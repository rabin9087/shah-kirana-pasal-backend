import { NextFunction, Request, Response } from "express";
import { createProduct, deleteAProductByID, getAllProducts, 
  getAProductByFilter, getAProductByID, getAProductByQRCodeNumber, getAProductBySKU, getAProductBySlug, getProductListByCategory,
  updateAProduct, updateAProductByID, updateAProductStatusByID, updateAProductThumbnailByID
} from "../model/product/product.model";
import slugify from 'slugify'
import { getACategoryBySlug } from "../model/category/category.model";
import productSchema from "../model/product/product.schema";
import { redisClient } from "../utils/redis";

export const createNewProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Process uploaded files
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.MulterS3.File[] };
      
      if (files["images"]) {
        req.body.images = files["images"].map(item => item.location);
      }
      
      if (files["thumbnail"]) {
        req.body.thumbnail = files["thumbnail"][0].location;
      }
    }

    // Validate required fields with better error messages
    const requiredFields = [
      { field: 'name', type: 'string', message: 'Product name is required and must be a string' },
      { field: 'sku', type: 'string', message: 'SKU is required and must be a string' },
      { field: 'qrCodeNumber', type: 'string', message: 'QR Code number is required and must be a string' },
      { field: 'price', type: 'string', message: 'Price is required' },
      { field: 'quantity', type: 'string', message: 'Quantity is required' },
      { field: 'parentCategoryID', type: 'string', message: 'Category is required' }
    ];

    for (const { field, type, message } of requiredFields) {
      if (!req.body[field] || typeof req.body[field] !== type) {
        return res.status(400).json({
          status: "error",
          message,
        });
      }
    }

    // Generate slug
    req.body.slug = slugify(req.body.name.trim(), {
      replacement: '-',
      lower: true,
      strict: true,
      trim: true
    });

    const { sku, qrCodeNumber, slug } = req.body;

    // Check for existing SKU and generate new one if needed
    const generateRandomSKU = () => {
      return Math.floor(Math.random() * (9999999 - 100 + 1)) + 100;
    };

    let newSku = sku;
    let skuExists = await getAProductBySKU(newSku);

    while (skuExists?._id) {
      newSku = generateRandomSKU().toString();
      skuExists = await getAProductBySKU(newSku);
    }

    req.body.sku = newSku;

    // Check for existing QR code and slug
    const qrCode = await getAProductByQRCodeNumber(qrCodeNumber);
    const slugValue = await getAProductBySlug(slug); // FIXED: Use correct function

    if (qrCode?._id) {
      return res.status(400).json({
        status: "error",
        message: "QRCode value already exists! Enter different QRCode value",
      });
    }
    
    if (slugValue?._id) {
      return res.status(400).json({
        status: "error",
        message: "Slug already exists! Enter different product name",
      });
    }

    // Create the product
    const product = await createProduct(req.body);
    
    if (product?._id) {
      res.status(201).json({
        status: "success",
        message: "New Product has been created successfully!",
        data: product
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Error creating new product.",
      });
    }

  } catch (error) {
    console.error('Error in createNewProduct:', error);
    next(error);
  }
};
  
export const updateProductThumbnail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => { 
try {
   if (req.files) {
      const files = req.files as { [fieldname: string]: Express.MulterS3.File[] }
      // if (files["images"]) {
      //   req.body.images = files["images"].map(item => item.location)
      // }

      if (files["thumbnail"]) {
        req.body.thumbnail = files["thumbnail"][0].location
      }
      const { _id } = req.params
      const product = await updateAProductThumbnailByID(_id, req.body)
   
        product?._id
         ? res.json({
            status: "success",
            message: "Product thumbnail has been Updated successfully!",
            product
          })
        : res.json({
            status: "error",
            message: "Error updating product's Thumbnail.",
          })
    }
} catch (error) {
  next(error)
}

}

export const getAllProductListByLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Parse and validate query parameters with defaults
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 30)); // Cap at 100
    const search = (req.query.search as string)?.trim();
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const order = req.query.order === "desc" ? -1 : 1; // Fixed: asc should be 1, desc should be -1

    // Build optimized query
    const query: any = { status: "ACTIVE" }; // Filter active products at DB level
    if (search) {
      // Use text index for better performance if available
      // If you have a text index: query.$text = { $search: search };
      // Otherwise, use regex on indexed field
      query.name = { $regex: search, $options: "i" };
    }

    // Generate cache key with consistent ordering
    const cacheKey = `products:${page}:${limit}:${search || ""}:${sortBy}:${order}`;

    // Check Redis cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      return res.status(200).json(parsed);
    }

    // Use Promise.all for parallel execution
    const [total, products] = await Promise.all([
      productSchema.countDocuments(query),
      productSchema
        .find(query, { 
          costPrice: 0, // Exclude costPrice at DB level
          __v: 0,       // Exclude version field
          // Include only needed fields for better performance:
          // name: 1, price: 1, status: 1, createdAt: 1, etc.
        })
        .sort({ [sortBy]: order })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean() // Already present, good for performance
    ]);

    // No need to filter again since we filtered at DB level
    const responseData = {
      status: "success",
      message: "Products fetched successfully!",
      products, // Already filtered and without costPrice
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache with longer TTL for better hit rate, but shorter for search results
    const ttl = search ? 30 : 300; // 30s for search, 5min for regular queries
    
    // Fire and forget caching to avoid blocking response
    redisClient.setEx(cacheKey, ttl, JSON.stringify(responseData)).catch(console.error);

    return res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

// export const getAllProductListByLimit = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 30;
//     const search = req.query.search as string;
//     const sortBy = (req.query.sortBy as string) || "createdAt";
//     const order = req.query.order === "asc" ? -1 : 1;

//     const query: any = {};
//     if (search) {
//       query.name = { $regex: search, $options: "i" };
//     }

//     // Generate a unique cache key based on the query
//     const cacheKey = `products:page=${page}&limit=${limit}&search=${search || ""}&sortBy=${sortBy}&order=${order}`;

//     // Check Redis cache first
//     const cachedData = await redisClient.get(cacheKey);
//     if (cachedData) {
//       const parsed = JSON.parse(cachedData);
//       return res.status(200).json(parsed);
//     }

//     // If not cached, fetch from DB
//     const total = await productSchema.countDocuments(query);
//     const products = await productSchema
//       .find(query)
//       .sort({ [sortBy]: order })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .lean();

//     const filteredProducts = products
//       .map(({ costPrice, ...rest }) => rest)
//       .filter((item) => item.status === "ACTIVE");

//     const responseData = {
//       status: "success",
//       message: "Products fetched successfully!",
//       products: filteredProducts,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     };

//     // Cache the response for 60 seconds
//     await redisClient.setEx(cacheKey, 60, JSON.stringify(responseData));

//     // Send the response
//     return res.status(200).json(responseData);
//   } catch (error) {
//     next(error);
//   }
// };

export const getAllProductList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const products = await getAllProducts()
      const cacheKey = `allProducts:`;
       // 1. Check Redis cache
      const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
       const response = products?.length
         ? res.json({
            status: "success",
            message: "Here is list of all products!",
            products
          })
        : res.json({
            status: "error",
            message: "Error fetching product.",
        })
       await redisClient.setEx(cacheKey, 60, JSON.stringify(response));
      return res.json(response);
    } catch (error) {
      next(error);
    }
  };

   export const getAllProductListByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { slug } = req.params
      const cacheKey = `products:category:${slug}`;
       // 1. Check Redis cache
      const cachedData = await redisClient.get(cacheKey);


    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
      
      const cat = await getACategoryBySlug(slug)
      if (cat?._id) {
         const products = await getProductListByCategory(cat._id);
      const activeProducts = products?.filter(item => item.status === "ACTIVE");

      const response = activeProducts.length
        ? {
            status: "success",
            message: "Here is list of all products!",
            products: activeProducts,
          }
        : {
            status: "error",
            message: "No active products found for this category.",
          };

      // 3. Save response in Redis for 60 seconds (you can customize the time)
      await redisClient.setEx(cacheKey, 60, JSON.stringify(response));
      return res.json(response);
      } else {
        res.json({
            status: "error",
            message: `No products available for category: ${slug}`,          })
      }
      
    } catch (error) {
      next(error);
    }
  };

  export const fetchAProductByID = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {_id} = req.params
      const product = await getAProductByID(_id)
   
        product?._id
         ? res.json({
            status: "success",
            message: "Here is a product!",
            product
          })
        : res.json({
            status: "error",
            message: "Error fetching product.",
          })
    } catch (error) {
      next(error);
    }
  };

   export const fetchAProductByFilter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const product = await getAProductByFilter(req.query)
        product?._id
         ? res.json({
            status: "success",
            message: "Here is a product!",
            product
          })
        : res.json({
            status: "error",
            message: "Product Not Found!",
          })
    } catch (error) {
      next(error);
    }
  };

  export const fetchAProductByQRCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { code } = req.params
      console.log(code)
      console.log(req.params)

      const product = await getAProductByQRCodeNumber({qrCodeNumber: code})
      // if (userId && qrCodeNumber) { 
      //     await userSchema.findByIdAndUpdate(
      //           {_id: userId},
      //           {
      //             $push: { searchHistory: qrCodeNumber },
      //           },
      //           { new: true } // This option returns the updated document
      //         );
      //           }

        product?._id
         ? res.json({
            status: "success",
            message: "Here is a product!",
            product
          })
        : res.json({
            status: "error",
            message: "Product Not Found!",
          })
    } catch (error) {
      next(error);
    }
  };

  export const fetchAProductBySKUController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {sku} = req.params
      const product = await getAProductBySKU(sku)
   
        product?._id
         ? res.json({
            status: "success",
            message: "Here is a product!",
            product
          })
        : res.json({
            status: "error",
            message: "Product Not Found!",
          })
    } catch (error) {
      next(error);
    }
  };

  export const updateAProductController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
     const { images } = req.body;
      let oldImages = [];

    try {
    oldImages = JSON.parse(images); // Parse JSON string
  
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.MulterS3.File[] }
        
      if (files["addImages"]) {
        const newImages = files["addImages"].map(item => item.location)
        req.body.images = [...newImages, ...oldImages]
      }
        
      if (files["newThumbnail"]) {
        req.body.thumbnail = files["newThumbnail"][0].location
      }
      } else {
        req.body.images = JSON.parse(images);
      }
      
} catch (error) {
  }
      const { _id } = req.body
      const product = await updateAProductByID(_id, req.body)
   
        product?._id
         ? res.json({
            status: "success",
            message: "Product has been Updated successfully!",
            product
          })
        : res.json({
            status: "error",
            message: "Error updating product.",
          })
    } catch (error) {
      next(error);
    }
  };

   export const updateAProductStatusController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { _id } = req.params
      const {status} = req.body
      const product = await updateAProductStatusByID({_id, status})
   
        product?._id
         ? res.json({
            status: "success",
            message: "Product has been Updated successfully!",
          })
        : res.json({
            status: "error",
            message: "Error updating product.",
          })
    } catch (error) {
      next(error);
    }
  };

  export const deleteProductByID = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {_id} = req.params
      const product = await deleteAProductByID(_id)
   
        product?._id
         ? res.json({
            status: "success",
            message: "Product has been deleted successfully!",
          })
        : res.json({
            status: "error",
            message: "Error deleting product.",
          })
    } catch (error) {
      next(error);
    }
  };

  export const updateProductByID = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { _id } = req.params
      const { ...rest} = req.body
      const product = await updateAProduct(_id, {...rest})
   
        product?.matchedCount
         ? res.json({
            status: "success",
            message: "Product has been updated successfully!",
            product
          })
        : res.json({
            status: "error",
            message: "Error updating product.",
          })
    } catch (error) {
      next(error);
    }
  };

export const updateProductQuantities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedProducts = [];
    for (const item of req.body.items) {
      const productId = item.productId

      const product = await productSchema.findById(productId);

      if (!product) {
        console.warn(`Product with ID ${productId} not found`);
        continue;
      }

      const suppliedQty = parseInt(item.supplied) || 0;
      const newQuantity = product.quantity - suppliedQty;

      product.quantity = newQuantity < 0 ? 0 : newQuantity;
      await product.save();
      updatedProducts.push(product);
    }

    return res.json({
      status: 'success',
      message: 'Products have been updated successfully!',
    });
  } catch (error) {
    next(error);
  }
};