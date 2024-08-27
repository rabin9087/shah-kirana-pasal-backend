import { NextFunction, Request, Response } from "express";
import { createProduct, deleteAProductByID, getAllProducts, getAProductByFilter, getAProductByID, getAProductByQRCodeNumber, getAProductBySKU, getProductListByCategory, updateAProduct, updateAProductByID } from "../model/product/product.model";
import slugify from 'slugify'
import { getACategoryBySlug } from "../model/category/category.model";

export const createNewProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {
      req.body.slug = slugify(req.body.name, {
      replacement: '-', 
        lower: true,
      trim: true
    })
    const { sku, qrCodeNumber, slug, productLocation } = req.body
    const parts = productLocation.split('.')
    // Define the prefixes
    const prefixes = ['A', 'B', 'S', 'L'];
    const formattedParts = parts.map((part: string, index:number) => {
    const paddedNumber = part.padStart(2, '0');
    return `${prefixes[index]}${paddedNumber}`;
    });
    
    // Join the formatted parts with ' - ' separator
    req.body.productLocation = formattedParts.join('-');

      const skuValue = await getAProductBySKU(sku)
      const qrCode  = await getAProductByQRCodeNumber(qrCodeNumber)
      const slugValue  = await getAProductByQRCodeNumber(slug)
      if(skuValue?._id)  {
        return res.json({
        status: "error",
        message: "SKU name already exist! \n Write different sku name",
        })
      } else if (qrCode?._id) {
        return res.json({
        status: "error",
        message: "QRCode value already exist! \n Enter different QRCode value",
        })
      } else if (slugValue?._id) {
        return res.json({
        status: "error",
        message: "Slug value already exist! \n Enter different Slug value",
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
            products
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
      console.log(code)
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

  export const updateAProductController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
       req.body.slug = slugify(req.body.name, {
      replacement: '-', 
        lower: true,
      trim: true
       })
      
      const {productLocation} = req.body
      const parts = productLocation.split('.')
    // Define the prefixes
    const prefixes = ['A', 'B', 'S', 'L'];
    const formattedParts = parts.map((part: string, index:number) => {
    const paddedNumber = part.padStart(2, '0');
    return `${prefixes[index]}${paddedNumber}`;
    });
    
    // Join the formatted parts with ' - ' separator
    req.body.productLocation = formattedParts.join(' - ');

      const {_id} = req.params
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
      const product = await getAProductByFilter({_id, status})
   
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
            product
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
      const {_id, ...rest} = req.body
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
