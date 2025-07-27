"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DueSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, indexes: 1, ref: 'user', required: true },
    salesId: { type: mongoose_1.default.Schema.Types.ObjectId, indexes: 1, ref: 'storeSale', required: true },
    totalAmout: { type: Number, required: true },
    dueAmount: { type: Number, required: true },
    paymentHistory: [{ paymentMethod: { type: String }, amount: { type: Number }, paymentDate: { type: Date } }],
    duePaymentStatus: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model('due', DueSchema);
