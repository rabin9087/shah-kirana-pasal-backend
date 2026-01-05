"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = __importDefault(require("mongoose"));
const cfStockSchema = new mongoose_2.default.Schema({
    name: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true,
        index: true,
    },
    location: {
        type: String,
        required: true,
        index: true,
    },
    identifier: {
        type: String,
        required: true,
        index: true,
    },
    locationType: {
        type: String,
        required: true,
        index: true,
    },
    locationCategory: {
        type: String,
        required: true,
        index: true,
    },
    category: {
        type: String,
        required: true,
        index: true,
    },
    price: {
        type: mongoose_1.default.Schema.Types.Decimal128,
        required: true,
        index: true,
    },
    expiryDate: {
        type: String,
        required: true,
        index: true,
    },
    quantity: {
        type: Number,
        required: true,
        index: true,
    },
}, { timestamps: true });
exports.default = mongoose_2.default.model("cfStock", cfStockSchema);
