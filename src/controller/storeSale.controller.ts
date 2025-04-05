import { NextFunction, Request, Response } from "express";
import { IStoreSaleItemTypes } from "../model/storeSale/storeSale.schema";
import productSchema from "../model/product/product.schema";
import { randomOTPGenerator } from "../utils/randomGenerator";
import { createStoreSaleOrder, getAStoreSaleOrderByOrderNumber, getDailyStoreSale } from "../model/storeSale/storeSale.model";


export const addCostPriceToItems = async (items: IStoreSaleItemTypes[]) => {
  const updatedItems = await Promise.all(
    items.map(async (item) => {
      const product = await productSchema.findById(item.productId).lean();
      return {
        ...item,
        costPrice: product?.costPrice ?? null,
      };
    })
  );
  return updatedItems;
};

export const createNewStoreSaleOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   let orderNumber: string | undefined;
    let isUnique = false;
    // Loop until a unique orderNumber is generated
    while (!isUnique) {
      orderNumber = randomOTPGenerator();
      const existingOrder = await getAStoreSaleOrderByOrderNumber({ orderNumber });
      if (existingOrder.length === 0) {
        isUnique = true;
      }
    }
     req.body.items = await addCostPriceToItems(req.body.items);
    // Create the order with the unique orderNumber
    const storeSales = await createStoreSaleOrder({ orderNumber, ...req.body });

    if (storeSales?._id) {
      res.json({
        status: 'success',
        message: 'New order has been created successfully!',
        storeSales,
      });
    } else {
      res.json({
        status: 'error',
        message: 'Error creating new order. Please try again.',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getDailySalesController = async (
req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        const storeSales = await getDailyStoreSale();
         storeSales.length
      ? res.json({
          status: "success",
          message: "All Orders",
          storeSales,
        })
      : res.json({
          status: "error",
          message: "Error getting total sales",
        });

    } catch (error) {
        next(error)
    }
}