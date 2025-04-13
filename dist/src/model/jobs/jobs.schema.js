"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const JobsSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    jobCatergory: { type: String, ref: 'jobCategory' },
    jobTypes: { type: String, required: true },
    advanceAmount: { type: Number, default: 0 },
    newPayment: [{
            subject: { type: String, },
            amount: { type: Number },
            createdAt: { type: Date, default: Date.now },
        }],
    contractAmount: { type: Number, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("job", JobsSchema);
