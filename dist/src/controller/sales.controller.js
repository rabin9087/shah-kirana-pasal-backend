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
exports.getDailySalesController = exports.getAllSalesController = exports.getSaleAmountController = void 0;
const sales_model_1 = require("../model/sales/sales.model");
const storeSale_model_1 = require("../model/storeSale/storeSale.model");
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
const getAllSalesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeSales = yield (0, storeSale_model_1.getAllStoreSale)();
        storeSales.length
            ? res.json({
                status: "success",
                message: "All Orders",
                storeSales,
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
exports.getAllSalesController = getAllSalesController;
const getDailySalesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeSales = yield (0, storeSale_model_1.getDailyStoreSale)();
        storeSales.length
            ? res.json({
                status: "success",
                message: "All Orders",
                storeSales,
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
exports.getDailySalesController = getDailySalesController;
