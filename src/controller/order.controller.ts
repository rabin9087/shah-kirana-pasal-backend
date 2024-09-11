import { NextFunction, Request, Response } from "express";
import { createOrder } from "../model/order/order.model";
import { randomOTPGenerator } from "../utils/randomGenerator";

export const createNewOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderNumber = randomOTPGenerator()
    const order = await createOrder({ orderNumber, ...req.body });
    if (!order?.orderNumber) {
      const orderNumber = randomOTPGenerator()
      const order = await createOrder({ orderNumber, ...req.body });
    }
    order?._id
      ? res.json({
          status: "success",
          message: "Please check your email to verify your account",
          order
        })
      : res.json({
          status: "error",
          message: "Error creating the account.",
        });
  } catch (error) {
    next(error);
  }
};