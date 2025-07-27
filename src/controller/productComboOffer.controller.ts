import { NextFunction, Request, Response } from "express";
import { createProductOfferCombo, getAllProductComboOffers, getProductComboOfferById } from "../model/productComboOffer/productComboOffer.model";
import { IProductComboOffer } from "../model/productComboOffer/productComboOffer.schema";

export const createProductComboOfferController = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const newProductComboOffer = await createProductOfferCombo(req.body as IProductComboOffer)
        if (newProductComboOffer.id) {
            return res.status(200).json({
                status: "success",
                message: "Product combo offer created successfully.",
            })
        } else { }
        return res.status(400).json({
            status: "error",
            message: "Failed to create product combo offer."
        });

    } catch (error) {
       next(error)
    }
}

export const getAllProductComboOfferController = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const productComboOffers = await getAllProductComboOffers()
        if (productComboOffers.length > 0) {
            return res.status(200).json({
                status: "success",
                message: "Here are all product combo offer.",
                productComboOffers
            })
        } else { }
        return res.status(400).json({
            status: "error",
            message: "Failed to create product combo offer."
        });

    } catch (error) {
       next(error)
    }
}

export const getAProductComboOfferController = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const { _id } = req.params;
        const productComboOffer = await getProductComboOfferById(_id)
        if (productComboOffer?.id) {
            return res.status(200).json({
                status: "success",
                message: "Here is a product combo offer.",
                productComboOffer
            })
        } else { }
        return res.status(400).json({
            status: "error",
            message: "Failed to create product combo offer."
        });

    } catch (error) {
       next(error)
    }
}