import { NextFunction, Request, Response } from "express";
import { createOrder, getAOrderByFilter, getAOrderByOrderNumber, getAOrdersByDate, getAllOrders, updateAOrder } from "../model/order/order.model";
import { randomOTPGenerator } from "../utils/randomGenerator";

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
    console.log(req.params)
    // const orderNumber = randomOTPGenerator()
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