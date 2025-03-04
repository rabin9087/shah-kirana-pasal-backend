"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const types_1 = require("../../../types");
const CartItemSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "product",
    },
    price: String,
    orderQuantity: Number,
    note: String,
});
const CartHistorySchema = new mongoose_1.default.Schema({
    items: [CartItemSchema],
    amount: Number,
    purchasedAt: {
        type: Date,
        default: Date.now,
    },
    orderNumber: String
});
const userSchema = new mongoose_1.default.Schema({
    status: {
        type: String,
        default: "ACTIVE",
    },
    role: {
        type: String,
        enum: types_1.Role,
        required: true,
        default: "USER",
    },
    fName: {
        type: String,
        required: true,
    },
    lName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        index: 1,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
        default: "",
    },
    refreshJWT: {
        type: String,
        default: "",
    },
    address: {
        type: String,
        default: "",
    },
    profile: {
        type: String,
        default: "",
    },
    cart: {
        type: [CartItemSchema],
        default: [],
    },
    cartHistory: {
        type: [CartHistorySchema],
        default: [],
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("user", userSchema);
