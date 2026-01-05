import { NextFunction, Request, Response } from "express";
import { createSTOCK, getStockByIdentifier, getStockesByLocation, getStockesBySKU, insertBulkSTOCK } from "../model/cfStock/cfStock.model";
import { ProductTypeStock } from "../model/cfStock/cfStock.Schema";

export const createCfStockController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
try {
    const data: ProductTypeStock = req.body;
        const stock = await createSTOCK(data);
        stock?._id
        ? res.json({
            status: "success",
            message: "New Stock has been created successfully!",
            stock
          })
        : res.json({
            status: "error",
            message: "Error creating new stock.",
          });
} catch (error) {
    next(error);
}
}

export const uploadBulkStockController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Excel → JSON → comes as an array
        const stockArray: ProductTypeStock[] = req.body;

        if (!Array.isArray(stockArray)) {
            return res.status(400).json({ message: "Invalid data format" });
        }

        const result = await insertBulkSTOCK(stockArray);

        res.status(201).json({
            message: "Bulk stock upload successful",
            inserted: result.length,
            stocks: result,
        });
    } catch (error: any) {
         next(error);
    }
};

export const getStockBySKUController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Excel → JSON → comes as an array
        const {sku} = req.params;
        const result = await getStockesBySKU(sku);

        res.status(201).json({
            message: "All the stocks successful fetched",
            inserted: result.length,
            stocks: result,
        });
    } catch (error: any) {
         next(error);
    }
};

export const getStockByLocationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Excel → JSON → comes as an array
        const {location} = req.params;
        const result = await getStockesByLocation(location);

        res.status(201).json({
            message: "All the stocks successful fetched",
            inserted: result.length,
            stocks: result,
        });
    } catch (error: any) {
         next(error);
    }
};

export const getStockByIdentifierController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Excel → JSON → comes as an array
        const { identifier } = req.params;
        const result = await getStockByIdentifier(identifier);
        res.status(201).json({
            message: "All the stocks successful fetched",
            stock: result,
        });
    } catch (error: any) {
         next(error);
    }
};

export const UpdateStockByIdentifierController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Excel → JSON → comes as an array
        const { identifier } = req.params;
        const result = await getStockByIdentifier(identifier);
        res.status(201).json({
            message: "All the stocks successful fetched",
            stock: result,
        });
    } catch (error: any) {
         next(error);
    }
};