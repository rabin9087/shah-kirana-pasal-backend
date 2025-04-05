import { NextFunction, Request, Response } from "express";
import { getAllSales, getTotalSales } from "../model/sales/sales.model";

export const getSaleAmountController = async (
req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        const amount = await getTotalSales();
         amount.length
      ? res.json({
          status: "success",
          message: "All sales Amount",
          amount,
        })
      : res.json({
          status: "error",
          message: "Error getting total sales",
        });

    } catch (error) {
        next(error)
    }
}

export const getAllSalesController = async (
req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        const sales = await getAllSales();
         sales.length
      ? res.json({
          status: "success",
          message: "All Orders",
          sales,
        })
      : res.json({
          status: "error",
          message: "Error getting total sales",
        });

    } catch (error) {
        next(error)
    }
}