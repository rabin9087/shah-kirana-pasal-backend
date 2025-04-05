"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const JobPaymentSchema = new mongoose_1.default.Schema({
    jobId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Job", required: true },
    contractRate: { type: Number, required: true },
    advance: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Cash", "Card", "Bank Transfer", "Other"], required: true },
    paymentDate: { type: Date, required: true },
    remainingAmount: { type: Number, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("JobPayment", JobPaymentSchema);
