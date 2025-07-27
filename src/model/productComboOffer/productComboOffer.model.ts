import ProductComboOfferSchema, { IProductComboOffer } from "./productComboOffer.schema";

export const createProductOfferCombo = (offerObj: IProductComboOffer) => { 
    return new ProductComboOfferSchema(offerObj).save();
}

export const getAllProductComboOffers = () => {
    return ProductComboOfferSchema.find().populate("items.productId");
};

export const getProductComboOfferById = (id: string) => {
    return ProductComboOfferSchema.findById(id).populate("items");
}
export const updateProductComboOffer = (id: string, offerObj: IProductComboOffer) => {
    return ProductComboOfferSchema.findByIdAndUpdate(id, offerObj, { new: true }).populate("items");
}