"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAStoreSaleOrderByOrderNumber = exports.createStoreSaleOrder = void 0;
const storeSale_schema_1 = __importDefault(require("./storeSale.schema"));
const createStoreSaleOrder = (storeSaleObj) => {
    return new storeSale_schema_1.default(storeSaleObj).save();
};
exports.createStoreSaleOrder = createStoreSaleOrder;
const getAStoreSaleOrderByOrderNumber = (filter) => {
    return storeSale_schema_1.default.find(filter);
};
exports.getAStoreSaleOrderByOrderNumber = getAStoreSaleOrderByOrderNumber;
