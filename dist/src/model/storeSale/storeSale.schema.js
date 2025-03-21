"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = __importDefault(require("mongoose"));
const storeSaleSchema = new mongoose_2.default.Schema({
    name: {
        type: String,
        index: 1,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
        index: 1,
    },
    email: {
        type: String,
        index: 1,
    },
    items: {
        type: [{
                productId: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: 'product',
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                costPrice: {
                    type: Number,
                },
                orderQuantity: {
                    type: Number,
                    default: 0,
                },
            },],
        required: true
    },
    orderNumber: {
        type: Number,
        required: true,
        unique: true,
        index: 1,
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    saler: {
        userId: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'user',
            default: ""
        },
        name: {
            type: String,
            default: ""
        }
    },
}, { timestamps: true });
exports.default = mongoose_2.default.model("storeSale", storeSaleSchema);
