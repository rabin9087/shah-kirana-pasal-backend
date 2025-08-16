"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductComboOffer = exports.getProductComboOfferById = exports.getAllProductComboOffers = exports.createProductOfferCombo = void 0;
const productComboOffer_schema_1 = __importDefault(require("./productComboOffer.schema"));
const createProductOfferCombo = (offerObj) => {
    return new productComboOffer_schema_1.default(offerObj).save();
};
exports.createProductOfferCombo = createProductOfferCombo;
const getAllProductComboOffers = () => {
    return productComboOffer_schema_1.default.find().populate("items.productId");
};
exports.getAllProductComboOffers = getAllProductComboOffers;
const getProductComboOfferById = (id) => {
    return productComboOffer_schema_1.default.findById(id).populate("items.productId");
};
exports.getProductComboOfferById = getProductComboOfferById;
const updateProductComboOffer = (id, offerObj) => {
    return productComboOffer_schema_1.default.findByIdAndUpdate(id, offerObj, { new: true }).populate("items");
};
exports.updateProductComboOffer = updateProductComboOffer;
