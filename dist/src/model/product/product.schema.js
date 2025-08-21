"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: () => new mongoose_2.default.Types.ObjectId().toString(),
        index: true,
    },
    status: {
        type: String,
        default: "ACTIVE",
        enum: ['ACTIVE', 'INACTIVE'],
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
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
        index: 1,
    },
    parentCategoryID: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        indexes: true,
    },
    salesStartDate: {
        type: Date,
        indexes: true,
    },
    productWeight: {
        type: String,
    },
    salesPrice: {
        type: Number,
        indexes: true,
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
            index: true
        }],
    thumbnail: {
        type: String,
        default: "",
        index: 1,
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
        index: true,
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
        required: true,
        index: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("product", productSchema);
