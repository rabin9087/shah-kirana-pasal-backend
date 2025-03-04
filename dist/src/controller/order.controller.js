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
exports.updateAOrderController = exports.getAOrderByFilterController = exports.getOrdersByDateController = exports.getOrders = exports.createNewOrder = void 0;
const order_model_1 = require("../model/order/order.model");
const randomGenerator_1 = require("../utils/randomGenerator");
const createNewOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let orderNumber;
        let isUnique = false;
        while (!isUnique) {
            orderNumber = (0, randomGenerator_1.randomOTPGenerator)();
            const existingOrder = yield (0, order_model_1.getAOrderByOrderNumber)({ orderNumber });
            if (existingOrder.length === 0) {
                isUnique = true;
            }
        }
        const order = yield (0, order_model_1.createOrder)(Object.assign({ orderNumber }, req.body));
        if (order === null || order === void 0 ? void 0 : order._id) {
            res.json({
                status: 'success',
                message: 'New order has been created successfully!',
                order,
            });
        }
        else {
            res.json({
                status: 'error',
                message: 'Error creating new order. Please try again.',
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createNewOrder = createNewOrder;
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const orders = yield (0, order_model_1.getAllOrders)();
        (orders === null || orders === void 0 ? void 0 : orders.length)
            ? res.json({
                status: "success",
                message: "All orders has been return successfully!",
                orders
            })
            : res.json({
                status: "error",
                message: "Error creating new order. \n Try again!.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.getOrders = getOrders;
const getOrdersByDateController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.params;
        const orders = yield (0, order_model_1.getAOrdersByDate)(date);
        (orders === null || orders === void 0 ? void 0 : orders.length)
            ? res.json({
                status: "success",
                message: "All orders has been return successfully!",
                orders
            })
            : res.json({
                status: "Error",
                message: `Orders not available for ${date}. \n Try again!.`,
                orders
            });
    }
    catch (error) {
        next(error);
    }
});
exports.getOrdersByDateController = getOrdersByDateController;
const getAOrderByFilterController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params);
        const order = yield (0, order_model_1.getAOrderByFilter)(req.params);
        (order === null || order === void 0 ? void 0 : order._id)
            ? res.json({
                status: "success",
                message: "A order has been return successfully!",
                order
            })
            : res.json({
                status: "error",
                message: "Error creating new order. \n Try again!.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.getAOrderByFilterController = getAOrderByFilterController;
const updateAOrderController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const order = yield (0, order_model_1.updateAOrder)(_id, req.body);
        order.matchedCount > 0
            ? res.json({
                status: "success",
                message: "Orders Updated successfully!",
            })
            : res.json({
                status: "error",
                message: "Error creating new order. \n Try again!.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.updateAOrderController = updateAOrderController;
