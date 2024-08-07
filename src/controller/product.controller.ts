import { NextFunction, Request, Response } from "express";
import { createProduct, deleteAProductByID, getAllProducts, getAProductByFilter, getAProductByID, getAProductByQRCodeNumber, getAProductBySKU, updateAProduct, updateAProductByID } from "../model/product/product.model";
import slugify from 'slugify'

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
      const {sku, qrCodeNumber, slug} = req.body
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
            message: "Product Not Found1",
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
