"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    items: {
        type: [{
                productId: {
                    type: mongoose_2.default.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                note: {
                    type: String,
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
    deliverStatus: {
        type: String,
        required: true
    },
    deliveryDate: {
        date: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        }
    },
    requestDeliveryDate: {
        type: String,
        required: true
    },
    payment: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("order", orderSchema);
