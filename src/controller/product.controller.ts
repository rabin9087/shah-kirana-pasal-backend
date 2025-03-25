import { NextFunction, Request, Response } from "express";
import { createProduct, deleteAProductByID, getAllProducts, 
  getAProductByFilter, getAProductByID, getAProductByQRCodeNumber, getAProductBySKU, getProductListByCategory,
  updateAProduct, updateAProductByID, updateAProductStatusByID, updateAProductThumbnailByID
} from "../model/product/product.model";
import slugify from 'slugify'
import { getACategoryBySlug } from "../model/category/category.model";
import productSchema from "../model/product/product.schema";

export const createNewProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {
  
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.MulterS3.File[] }
      if (files["images"]) {
        req.body.images = files["images"].map(item => item.location)
      }

      if (files["thumbnail"]) {
        req.body.thumbnail = files["thumbnail"][0].location
      }
    }
      req.body.slug = slugify(req.body.name, {
      replacement: '-', 
        lower: true,
      trim: true
    })
    const { sku, qrCodeNumber, slug } = req.body

    const generateRandomSKU = () => {
      return Math.floor(Math.random() * (9999999 - 100 + 1)) + 100; // Generates a number between 100 and 9999999
    };

  let newSku = sku;
  let skuExists = await getAProductBySKU(newSku);

// Check if SKU already exists and generate a new one if necessary
    while (skuExists?._id) {
      newSku = generateRandomSKU().toString();
      skuExists = await getAProductBySKU(newSku);
    }
      const qrCode  = await getAProductByQRCodeNumber(qrCodeNumber)
    const slugValue = await getAProductByQRCodeNumber(slug)
    
     if (qrCode?._id) {
        return res.json({
        status: "error",
        message: "QRCode value already exist! \n Enter different QRCode value",
        })
      } else if (slugValue?._id) {
        return res.json({
        status: "error",
        message: "Slug already exist! \n Enter different Slug value",
        })
      }
      else {
        const product = await createProduct(req.body)
        product?._id
        ? res.json({
            status: "success",
            message: "New Product has been created successfully!",
          })
        : res.json({
            status: "error",
            message: "Error creating new product.",
          });}
    } catch (error) {
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 30;
    const search = req.query.search as string;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const order = req.query.order === "asc" ? -1 : 1;

    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive search
    }

    const total = await productSchema.countDocuments(query);
    const products = await productSchema
      .find(query)
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      status: "success",
      message: "Products fetched successfully!",
      products: products.map(({ costPrice, ...rest }) => (rest))
        .filter((item) => item.status === "ACTIVE"),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};


  export const getAllProductList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const products = await getAllProducts()
      
        products?.length
         ? res.json({
            status: "success",
            message: "Here is list of all products!",
            products
          })
        : res.json({
            status: "error",
            message: "Error fetching product.",
          })
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
      const cat = await getACategoryBySlug(slug)
      if (cat?._id) {
        const products = await getProductListByCategory(cat._id)
        products?.length
         ? res.json({
            status: "success",
            message: "Here is list of all products!",
            products: products.filter((item) => item.status === "ACTIVE")
          })
        : res.json({
            status: "error",
            message: "Error fetching product.",
          })
      } else {
        res.json({
            status: "error",
            message: "No products available for " + `${slug}`,
          })
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
      const {code} = req.params
      const product = await getAProductByQRCodeNumber({qrCodeNumber: code})
   
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
