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
exports.getAllOrderSalesController = exports.getSaleAmountController = void 0;
const sales_model_1 = require("../model/sales/sales.model");
const getSaleAmountController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const amount = yield (0, sales_model_1.getTotalSales)();
        amount.length
            ? res.json({
                status: "success",
                message: "All sales Amount",
                amount,
            })
            : res.json({
                status: "error",
                message: "Error getting total sales",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.getSaleAmountController = getSaleAmountController;
const getAllOrderSalesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sales = yield (0, sales_model_1.getAllOrderSales)();
        if (sales.length) {
            res.json({
                status: "success",
                message: "All Orders",
                sales,
            });
        }
        else {
            res.json({
                status: "success",
                message: "No online sales available",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getAllOrderSalesController = getAllOrderSalesController;
