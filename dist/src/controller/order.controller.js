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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewOrder = void 0;
const order_model_1 = require("../model/order/order.model");
const randomGenerator_1 = require("../utils/randomGenerator");
const createNewOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderNumber = (0, randomGenerator_1.randomOTPGenerator)();
        const order = yield (0, order_model_1.createOrder)(Object.assign({ orderNumber }, req.body));
        if (!(order === null || order === void 0 ? void 0 : order.orderNumber)) {
            const orderNumber = (0, randomGenerator_1.randomOTPGenerator)();
            const order = yield (0, order_model_1.createOrder)(Object.assign({ orderNumber }, req.body));
        }
        (order === null || order === void 0 ? void 0 : order._id)
            ? res.json({
                status: "success",
                message: "Please check your email to verify your account",
                order
            })
            : res.json({
                status: "error",
                message: "Error creating the account.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.createNewOrder = createNewOrder;
