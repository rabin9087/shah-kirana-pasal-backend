"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const types_1 = require("../../../types");
const categorySchema = new mongoose_1.default.Schema({
    status: {
        type: String,
        default: types_1.IStatus.ACTIVE,
    },
    name: {
        type: String,
        required: true,
    },
    alternativeName: {
        type: String,
    },
    description: {
        type: String,
    },
    slug: {
        type: String,
        unique: true,
        index: 1,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("category", categorySchema);
