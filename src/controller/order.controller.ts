import { NextFunction, Request, Response } from "express";
import { createOrder, getAllOrders } from "../model/order/order.model";
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
    const orderNumber = randomOTPGenerator()
    const order = await getAllOrders();
    order?.length
      ? res.json({
          status: "success",
          message: "All orders has been return successfully!",
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