import { NextFunction, Request, Response } from "express";
import { getTotalSales } from "../model/sales/sales.model";
import { getAllStoreSale, getDailyStoreSale } from "../model/storeSale/storeSale.model";

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
        const storeSales = await getAllStoreSale();
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