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
exports.createNewShopController = void 0;
const shop_model_1 = require("../model/shop/shop.model");
const createNewShopController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.files) {
            const files = req.files;
            if (files["logo"]) {
                req.body.logo = files["logo"][0].location;
            }
        }
        const shop = yield (0, shop_model_1.createShop)(req.body);
        (shop === null || shop === void 0 ? void 0 : shop._id)
            ? res.json({
                status: "success",
                message: "New shop has been created successfully!",
                shop
            })
            : res.json({
                status: "error",
                message: "Error creating new shop.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.createNewShopController = createNewShopController;
