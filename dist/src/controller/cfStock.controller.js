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
exports.UpdateStockByIdentifierController = exports.getStockByIdentifierController = exports.getStockByLocationController = exports.getStockBySKUController = exports.uploadBulkStockController = exports.createCfStockController = void 0;
const cfStock_model_1 = require("../model/cfStock/cfStock.model");
const createCfStockController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const stock = yield (0, cfStock_model_1.createSTOCK)(data);
        (stock === null || stock === void 0 ? void 0 : stock._id)
            ? res.json({
                status: "success",
                message: "New Stock has been created successfully!",
                stock
            })
            : res.json({
                status: "error",
                message: "Error creating new stock.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.createCfStockController = createCfStockController;
const uploadBulkStockController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stockArray = req.body;
        if (!Array.isArray(stockArray)) {
            return res.status(400).json({ message: "Invalid data format" });
        }
        const result = yield (0, cfStock_model_1.insertBulkSTOCK)(stockArray);
        res.status(201).json({
            message: "Bulk stock upload successful",
            inserted: result.length,
            stocks: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.uploadBulkStockController = uploadBulkStockController;
const getStockBySKUController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sku } = req.params;
        const result = yield (0, cfStock_model_1.getStockesBySKU)(sku);
        res.status(201).json({
            message: "All the stocks successful fetched",
            inserted: result.length,
            stocks: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getStockBySKUController = getStockBySKUController;
const getStockByLocationController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { location } = req.params;
        const result = yield (0, cfStock_model_1.getStockesByLocation)(location);
        res.status(201).json({
            message: "All the stocks successful fetched",
            inserted: result.length,
            stocks: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getStockByLocationController = getStockByLocationController;
const getStockByIdentifierController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifier } = req.params;
        const result = yield (0, cfStock_model_1.getStockByIdentifier)(identifier);
        res.status(201).json({
            message: "All the stocks successful fetched",
            stock: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getStockByIdentifierController = getStockByIdentifierController;
const UpdateStockByIdentifierController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifier } = req.params;
        const result = yield (0, cfStock_model_1.getStockByIdentifier)(identifier);
        res.status(201).json({
            message: "All the stocks successful fetched",
            stock: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.UpdateStockByIdentifierController = UpdateStockByIdentifierController;
