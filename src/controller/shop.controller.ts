import { NextFunction, Request, Response } from "express";
import { createShop, getAllShop } from "../model/shop/shop.model";

export const createNewShopController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.MulterS3.File[] }

      if (files["logo"]) {
        req.body.logo = files["logo"][0].location
      }
    }
    const shop = await createShop(req.body)
    
        shop?._id
        ? res.json({
            status: "success",
            message: "New shop has been created successfully!",
            shop
          })
        : res.json({
            status: "error",
            message: "Error creating new shop.",
          });
    } catch (error) {
      next(error);
    }
};

export const getAllShopController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {

    const shop = await getAllShop()
    
        shop?.length
        ? res.json({
            status: "success",
            message: "New shop has been created successfully!",
            allShop: shop
          })
        : res.json({
            status: "error",
            message: "Error creating new shop.",
          });
    } catch (error) {
      next(error);
    }
};