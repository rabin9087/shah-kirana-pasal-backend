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
exports.createPayment = void 0;
const stripe_1 = __importDefault(require("stripe"));
const createPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, currency } = req.body;
    const stripe = new stripe_1.default(process.env.STRIP_SECRET);
    const paymentIntents = yield stripe.paymentIntents.create({
        amount: parseInt(amount) * 100,
        currency: currency,
        automatic_payment_methods: {
            enabled: true,
        },
    });
    return res.json({
        clientSecret: paymentIntents.client_secret
    });
});
exports.createPayment = createPayment;
