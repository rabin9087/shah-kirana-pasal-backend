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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStoreSalesController = exports.getDailyStoreSalesController = exports.createNewStoreSaleOrder = exports.addCostPriceToItems = void 0;
const product_schema_1 = __importDefault(require("../model/product/product.schema"));
const randomGenerator_1 = require("../utils/randomGenerator");
const storeSale_model_1 = require("../model/storeSale/storeSale.model");
const addCostPriceToItems = (items) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedItems = yield Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const product = yield product_schema_1.default.findById(item.productId).lean();
        return Object.assign(Object.assign({}, item), { costPrice: (_a = product === null || product === void 0 ? void 0 : product.costPrice) !== null && _a !== void 0 ? _a : null });
    })));
    return updatedItems;
});
exports.addCostPriceToItems = addCostPriceToItems;
const createNewStoreSaleOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let orderNumber;
        let isUnique = false;
        while (!isUnique) {
            orderNumber = (0, randomGenerator_1.randomOTPGenerator)();
            const existingOrder = yield (0, storeSale_model_1.getAStoreSaleOrderByOrderNumber)({ orderNumber });
            if (existingOrder.length === 0) {
                isUnique = true;
            }
        }
        req.body.items = yield (0, exports.addCostPriceToItems)(req.body.items);
        const storeSales = yield (0, storeSale_model_1.createStoreSaleOrder)(Object.assign({ orderNumber }, req.body));
        if (storeSales === null || storeSales === void 0 ? void 0 : storeSales._id) {
            res.json({
                status: 'success',
                message: 'New order has been created successfully!',
                storeSales,
            });
        }
        else {
            res.json({
                status: 'error',
                message: 'Error creating new order. Please try again.',
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createNewStoreSaleOrder = createNewStoreSaleOrder;
const getDailyStoreSalesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.params;
        if (!date) {
            return res.status(400).json({
                status: "error",
                message: "Date parameter is required.",
            });
        }
        const storeSales = yield (0, storeSale_model_1.getDailyStoreSale)(date);
        if (storeSales && storeSales.length > 0) {
            return res.status(200).json({
                status: "success",
                message: "All Orders",
                storeSales,
            });
        }
        else {
            return res.status(200).json({
                status: "error",
                message: "No sales found for the given date.",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getDailyStoreSalesController = getDailyStoreSalesController;
const getAllStoreSalesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeSales = yield (0, storeSale_model_1.getAllStoreSale)();
        if (storeSales && storeSales.length > 0) {
            return res.status(200).json({
                status: "success",
                message: "All Store Sales available",
                storeSales,
            });
        }
        else {
            return res.status(200).json({
                status: "success",
                message: "No store sales available",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getAllStoreSalesController = getAllStoreSalesController;
