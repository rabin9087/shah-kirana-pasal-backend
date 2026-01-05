"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAProductComboOfferController = exports.getAllProductComboOfferController = exports.createProductComboOfferController = void 0;
const productComboOffer_model_1 = require("../model/productComboOffer/productComboOffer.model");
const createProductComboOfferController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newProductComboOffer = yield (0, productComboOffer_model_1.createProductOfferCombo)(req.body);
        if (newProductComboOffer.id) {
            return res.status(200).json({
                status: "success",
                message: "Product combo offer created successfully.",
            });
        }
        else { }
        return res.status(400).json({
            status: "error",
            message: "Failed to create product combo offer."
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createProductComboOfferController = createProductComboOfferController;
const getAllProductComboOfferController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productComboOffers = yield (0, productComboOffer_model_1.getAllProductComboOffers)();
        if (productComboOffers.length > 0) {
            return res.status(200).json({
                status: "success",
                message: "Here are all product combo offer.",
                productComboOffers
            });
        }
        else
            return res.status(400).json({
                status: "error",
                message: "Failed to find all product combo offer."
            });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllProductComboOfferController = getAllProductComboOfferController;
const getAProductComboOfferController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const productComboOffer = yield (0, productComboOffer_model_1.getProductComboOfferById)(_id);
        if (!productComboOffer) {
            return res.status(404).json({
                status: "error",
                message: "Product combo offer not found.",
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Here is the product combo offer.",
            productComboOffer,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAProductComboOfferController = getAProductComboOfferController;
