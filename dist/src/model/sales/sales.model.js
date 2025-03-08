"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSales = exports.getTotalSales = void 0;
const order_schema_1 = __importDefault(require("../order/order.schema"));
const getTotalSales = () => {
    return order_schema_1.default.find({}, 'amount paymentStatus').exec();
};
exports.getTotalSales = getTotalSales;
const getAllSales = () => {
    return order_schema_1.default.find({}, 'amount requestDeliveryDate items paymentStatus').exec();
};
exports.getAllSales = getAllSales;
