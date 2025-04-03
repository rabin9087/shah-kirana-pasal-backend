"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    status: {
        type: String,
        default: "ACTIVE",
    },
    name: {
        type: String,
        required: true,
    },
    alternateName: {
        type: String,
    },
    slug: {
        type: String,
        unique: true,
        index: 1,
        required: true,
    },
    description: {
        type: String,
    },
    parentCategoryID: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    salesStartDate: {
        type: Date,
    },
    productWeight: {
        type: String,
    },
    salesPrice: {
        type: Number,
    },
    retailerPrice: {
        type: Number,
    },
    costPrice: {
        type: Number,
    },
    salesEndDate: {
        type: Date,
    },
    sku: {
        type: String,
        unique: true,
        index: 1,
        required: true,
    },
    images: [{
            type: String,
        }],
    thumbnail: {
        type: String,
        default: ""
    },
    brand: {
        type: String,
    },
    storedAt: {
        type: String,
        required: true,
    },
    qrCodeNumber: {
        type: String,
        unique: true,
        index: 1,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    expireDate: {
        type: String,
        default: ""
    },
    quantity: {
        type: Number,
        required: true,
    },
    aggrateRating: {
        type: Number,
        default: 5
    },
    productReviews: {
        type: Array,
        default: []
    },
    productLocation: {
        type: String,
        required: true
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("product", productSchema);
