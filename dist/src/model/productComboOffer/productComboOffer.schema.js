"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productComboOfferSchema = new mongoose_1.default.Schema({
    offerName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    status: {
        type: String,
        default: 'ACTIVE',
        index: true,
    },
    items: [{
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId || String,
                ref: 'product',
                required: true,
            },
            price: {
                type: String,
                required: true
            },
            qty: {
                type: String,
                required: true,
                min: 1
            }
        }],
    thumbnail: {
        type: String,
        required: true,
        trim: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    discountAmount: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    offerStartDate: {
        type: Date,
        required: true,
    },
    offerEndDate: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model('productComboOffer', productComboOfferSchema);
