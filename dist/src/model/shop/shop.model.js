"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllShop = exports.createShop = void 0;
const shop_schema_1 = __importDefault(require("./shop.schema"));
const createShop = (shopObj) => {
    return new shop_schema_1.default(shopObj).save();
};
exports.createShop = createShop;
const getAllShop = () => {
    return shop_schema_1.default.find();
};
exports.getAllShop = getAllShop;
