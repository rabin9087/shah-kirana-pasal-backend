"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZipCheckout = exports.createPayment = void 0;
const axios_1 = __importDefault(require("axios"));
const stripe_1 = __importDefault(require("stripe"));
const ZIP_API_URL = process.env.ZIP_ENVIRONMENT === 'sandbox'
    ? 'https://api.sandbox.zip.co/checkout'
    : 'https://api.zip.co/checkout';
const createPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, currency } = req.body;
        const stripe = new stripe_1.default(process.env.STRIP_SECRET);
        const paymentIntents = yield stripe.paymentIntents.create({
            amount: parseInt(amount) * 100,
            currency,
            payment_method_types: [
                "card",
                "afterpay_clearpay",
            ],
        });
        return res.json({
            clientSecret: paymentIntents.client_secret
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createPayment = createPayment;
const createZipCheckout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, currency, orderReference, redirectUrl } = req.body;
        const response = yield axios_1.default.post(`${ZIP_API_URL}/checkouts`, {
            amount,
            currency,
            orderReference,
            redirectUrl,
            merchantId: process.env.ZIP_MERCHANT_ID,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.ZIP_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error creating Zip checkout:', error);
        res.status(500).json({ error: 'Failed to create Zip checkout' });
    }
});
exports.createZipCheckout = createZipCheckout;
