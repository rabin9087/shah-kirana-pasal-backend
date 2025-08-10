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
        const { amount, currency, paymentIntentId } = req.body;
        const stripe = new stripe_1.default(process.env.STRIP_SECRET);
        const amountInCents = Math.round(parseFloat(amount) * 100);
        console.log("Original amount:", amount);
        console.log("Amount in cents:", amountInCents);
        let paymentIntent;
        if (paymentIntentId) {
            try {
                paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
                if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'canceled') {
                    console.warn(`Attempted to update PaymentIntent ${paymentIntentId} which is in status: ${paymentIntent.status}. Creating a new one.`);
                    paymentIntent = yield stripe.paymentIntents.create({
                        amount: amountInCents,
                        currency: currency || 'aud',
                        payment_method_types: [
                            "card",
                            "afterpay_clearpay",
                            "zip",
                        ],
                    });
                }
                else {
                    paymentIntent = yield stripe.paymentIntents.update(paymentIntentId, {
                        amount: amountInCents,
                        currency: currency || 'aud',
                    });
                }
            }
            catch (error) {
                if (error.type === 'StripeInvalidRequestError') {
                    console.warn(`PaymentIntent ${paymentIntentId} not found or invalid. Creating a new one.`);
                    paymentIntent = yield stripe.paymentIntents.create({
                        amount: amountInCents,
                        currency: currency || 'aud',
                        payment_method_types: [
                            "card",
                            "afterpay_clearpay",
                            "zip",
                        ],
                    });
                }
                else {
                    throw error;
                }
            }
        }
        else {
            paymentIntent = yield stripe.paymentIntents.create({
                amount: amountInCents,
                currency: currency || 'aud',
                payment_method_types: [
                    "card",
                    "afterpay_clearpay",
                    "zip",
                ],
            });
        }
        return res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    }
    catch (error) {
        console.error("Error in createPayment:", error);
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
