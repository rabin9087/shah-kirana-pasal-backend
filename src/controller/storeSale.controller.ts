import { NextFunction, Request, Response } from "express";
import { IStoreSaleItemTypes } from "../model/storeSale/storeSale.schema";
import productSchema from "../model/product/product.schema";
import { randomOTPGenerator } from "../utils/randomGenerator";
import { createStoreSaleOrder, getAStoreSaleOrderByOrderNumber, getAllStoreSale, getDailyStoreSale } from "../model/storeSale/storeSale.model";


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

export const getDailyStoreSalesController = async (
req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
      const { date } = req.params;

    if (!date) {
      return res.status(400).json({
        status: "error",
        message: "Date parameter is required.",
      });
    }

    const storeSales = await getDailyStoreSale(date);

    if (storeSales && storeSales.length > 0) {
      return res.status(200).json({
        status: "success",
        message: "All Orders",
        storeSales,
      });
    } else {
      return res.status(200).json({
        status: "error",
        message: "No sales found for the given date.",
      });
    }
    } catch (error) {
        next(error)
    }
}

export const getAllStoreSalesController = async (
req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const storeSales = await getAllStoreSale();

    if (storeSales && storeSales.length > 0) {
      return res.status(200).json({
        status: "success",
        message: "All Store Sales available",
        storeSales,
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: "No store sales available",
      });
    }
    } catch (error) {
        next(error)
    }
}