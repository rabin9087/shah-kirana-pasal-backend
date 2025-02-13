import { NextFunction, Request, Response } from "express";
import { createOrder, getAOrdersByDate, getAllOrders, updateAOrder } from "../model/order/order.model";
import { randomOTPGenerator } from "../utils/randomGenerator";

export const createNewOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body)
    const orderNumber = randomOTPGenerator()
    const order = await createOrder({ orderNumber, ...req.body });
    if (!order?.orderNumber) {
      const orderNumber = randomOTPGenerator()
       await createOrder({ orderNumber, ...req.body });
    }
    order?._id
      ? res.json({
          status: "success",
          message: "New order has been created successfully!",
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

export const updateAOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;
    // const orderNumber = randomOTPGenerator()
    const order = await updateAOrder(_id as string, req.body);
    order.matchedCount > 0
      ? res.json({
          status: "success",
          message: "Orders Updated successfully!",
        })
      : res.json({
          status: "error",
          message: "Error creating new order. \n Try again!.",
        });
  } catch (error) {
    next(error);
  }
};