import { NextFunction, Request, Response } from "express";
import { createOrder, getAOrderByFilter, getAOrderByOrderNumber, getAOrdersByDate, getAllOrders, updateAOrder } from "../model/order/order.model";
import { randomOTPGenerator } from "../utils/randomGenerator";
import { IItemTypes } from "../model/order/order.schema";
import productSchema from "../model/product/product.schema";
import { updateProductQuantities } from "./product.controller";

export const addCostPriceToItems = async (items: IItemTypes[]) => {
  const updatedItems = await Promise.all(
    items.map(async (item) => {
      const product = await productSchema.findById(item.productId);
      return {
        ...item,
        costPrice: product?.costPrice ?? null,
      };
    })
  );
  return updatedItems;
};

export const createNewOrder = async (
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
      const existingOrder = await getAOrderByOrderNumber({ orderNumber });
      if (existingOrder.length === 0) {
        isUnique = true;
      }
    }
    req.body.items = await addCostPriceToItems(req.body.items);
    // Create the order with the unique orderNumber
    const order = await createOrder({ orderNumber, ...req.body });

    if (order?._id) {
      res.json({
        status: 'success',
        message: 'New order has been created successfully!',
        order,
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

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body)
    // const orderNumber = randomOTPGenerator()
    const orders = await getAllOrders();
    orders?.length
      ? res.json({
          status: "success",
          message: "All orders has been return successfully!",
          orders
        })
      : res.json({
          status: "error",
          message: "Error creating new order. \n Try again!.",
        });
  } catch (error) {
    next(error);
  }
};

export const getOrdersByDateController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date } = req.params;
    // const orderNumber = randomOTPGenerator()
    const orders = await getAOrdersByDate(date);
    orders?.length
      ?  res.json({
          status: "success",
          message: "All orders has been return successfully!",
          orders
        })
      : res.json({
          status: "Error",
        message: `Orders not available for ${date}. \n Try again!.`,
        orders
        });
  } catch (error) {
    next(error);
  }
};

export const getAOrderByFilterController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await getAOrderByFilter(req.params);
    order?._id
      ? res.json({
          status: "success",
          message: "A order has been return successfully!",
          order
        })
      : res.json({
          status: "error",
          message: "Error creating new order. \n Try again!.",
        });
  } catch (error) {
    next(error);
  }
};

export const updateAOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;
    // const orderNumber = randomOTPGenerator()
    if (req.body.items) {
      req.body.items = await addCostPriceToItems(req.body.items);
    }
    
    const updatedOrder = await updateAOrder(_id as string, req.body);
    updatedOrder
      ? res.json({
          status: "success",
          message: "Orders Updated successfully!",
          updatedOrder: updatedOrder.items,
        })
      : res.json({
          status: "error",
          message: "Error creating new order. \n Try again!.",
        });
  } catch (error) {
    next(error);
  }
};