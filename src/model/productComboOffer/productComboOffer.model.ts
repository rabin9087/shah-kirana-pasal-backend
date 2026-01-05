import mongoose from "mongoose";
import ProductComboOfferSchema, { IProductComboOffer } from "./productComboOffer.schema";

export const createProductOfferCombo = (offerObj: IProductComboOffer) => { 
    return new ProductComboOfferSchema(offerObj).save();
}

export const getAllProductComboOffers = () => {
    return ProductComboOfferSchema.find().populate("items.productId", "name price thumbnail qrCodeNumber parentCategoryID");
};

export const getProductComboOfferById = (offerName: string) => {
    console.log(offerName)
   return ProductComboOfferSchema.findOne({offerName}).populate("items.productId");
}

export const updateProductComboOffer = (id: string, offerObj: IProductComboOffer) => {
    return ProductComboOfferSchema.findByIdAndUpdate(id, offerObj, { new: true }).populate("items");
}