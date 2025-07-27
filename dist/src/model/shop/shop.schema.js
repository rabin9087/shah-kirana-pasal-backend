"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ShopSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user', required: true },
    description: { type: String, trim: true },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        country: { type: String, required: true },
        postalCode: { type: String },
    },
    logo: { type: String, default: "" },
    slogan: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model('shop', ShopSchema);
