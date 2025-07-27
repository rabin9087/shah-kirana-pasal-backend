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
exports.updateMultipleOrderController = exports.updateAOrderController = exports.getAOrderByFilterController = exports.getOrdersByDateController = exports.getOrders = exports.createNewOrder = exports.addCostPriceToItems = void 0;
const order_model_1 = require("../model/order/order.model");
const randomGenerator_1 = require("../utils/randomGenerator");
const order_schema_1 = __importDefault(require("../model/order/order.schema"));
const product_schema_1 = __importDefault(require("../model/product/product.schema"));
const axios_1 = __importDefault(require("axios"));
const addCostPriceToItems = (items) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedItems = yield Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const product = yield product_schema_1.default.findById(item.productId);
        return Object.assign(Object.assign({}, item), { costPrice: (_a = product === null || product === void 0 ? void 0 : product.costPrice) !== null && _a !== void 0 ? _a : null });
    })));
    return updatedItems;
});
exports.addCostPriceToItems = addCostPriceToItems;
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
        req.body.items = yield (0, exports.addCostPriceToItems)(req.body.items);
        const order = yield (0, order_model_1.createOrder)(Object.assign({ orderNumber }, req.body));
        if (order === null || order === void 0 ? void 0 : order._id) {
            const productIds = order.items.map(item => item.productId);
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${order.orderNumber}&size=150x150`;
            const products = yield product_schema_1.default.find({ _id: { $in: productIds } });
            const productMap = {};
            products.forEach(prod => {
                var _a;
                productMap[prod._id.toString()] = {
                    name: prod.name,
                    image: ((_a = prod.images) === null || _a === void 0 ? void 0 : _a[0]) || '',
                };
            });
            const itemsWithDetails = order.items.map(({ productId, price, quantity, note }) => {
                const prod = productMap[productId.toString()];
                return {
                    productId,
                    productName: (prod === null || prod === void 0 ? void 0 : prod.name) || 'Unknown',
                    productImage: (prod === null || prod === void 0 ? void 0 : prod.image) || '',
                    quantity,
                    price,
                    note,
                };
            });
            const padLeft = (str, length) => str.length >= length ? str.slice(0, length - 1) + '…' : ' '.repeat(length - str.length) + str;
            const padRight = (str, length) => str.length >= length ? str.slice(0, length - 1) + '…' : str + ' '.repeat(length - str.length);
            const formattedItemsText = [
                `${padRight('S.N.', 5)}${padRight('ITEM NAME', 50)}${padLeft('QTY', 5)}${padLeft('PRICE', 10)}${padLeft('TOTAL', 10)}`,
                '-'.repeat(80),
                ...itemsWithDetails.map(({ productName, quantity, price }, i) => {
                    const total = price * quantity;
                    return (`${padRight((i + 1).toString(), 5)}` +
                        `${padRight(productName.toUpperCase(), 50)}` +
                        `${padLeft(quantity.toString(), 5)}` +
                        `${padLeft(`@$${price.toFixed(2)}`, 10)}` +
                        `${padLeft(`$${total.toFixed(2)}`, 10)}`);
                }),
            ].join('\n');
            const grandTotal = itemsWithDetails.reduce((acc, item) => acc + item.quantity * item.price, 0);
            const htmlItems = `
<pre style="font-family: monospace; font-size: 14px; line-height: 1.4;">
🛒 Order Receipt

Customer Name : ${order.name}
Phone         : ${order.phone}
Email         : ${order.email}
Order Number  : ${order.orderNumber}

${formattedItemsText}

${padLeft("Grand Total:", 70)} $${grandTotal.toFixed(2)}
</pre>
<img src="${qrCodeUrl}" alt="QR Code" style="margin-top: 10px;" />
`;
            const ZAPIER_WEBHOOK_URL_CREATE_ORDER = process.env.ZAPIER_WEBHOOK_URL_CREATE_ORDER;
            yield axios_1.default.post(ZAPIER_WEBHOOK_URL_CREATE_ORDER, {
                customerName: order.name,
                orderNumber: order.orderNumber,
                total: `$${order.amount.toFixed(2)}`,
                email: order.email,
                phone: order.phone,
                receiptHtml: htmlItems,
                qrCodeUrl,
                items: formattedItemsText,
            });
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
        if (req.body.items) {
            yield updateProductsQuantities(req.body.items);
            req.body.items = yield (0, exports.addCostPriceToItems)(req.body.items);
        }
        const updatedOrder = yield (0, order_model_1.updateAOrder)(_id, req.body);
        if (updatedOrder === null || updatedOrder === void 0 ? void 0 : updatedOrder._id) {
            const ZAPIER_WEBHOOK_URL_ORDER_STATUS = process.env.ZAPIER_WEBHOOK_URL_ORDER_STATUS;
            axios_1.default.post(ZAPIER_WEBHOOK_URL_ORDER_STATUS, {
                status: req.body.deliveryStatus,
                name: updatedOrder.name,
                email: updatedOrder.email,
                orderNumber: updatedOrder.orderNumber,
            });
        }
        updatedOrder
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
const updateMultipleOrderController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incomingOrders = req.body;
        if (!Array.isArray(incomingOrders) || incomingOrders.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "No orders provided",
            });
        }
        for (const { orderNumber, items, deliveryStatus } of incomingOrders) {
            if (!orderNumber || !Array.isArray(items))
                continue;
            yield updateProductsQuantities(items);
            const updatedItems = yield (0, exports.addCostPriceToItems)(items);
            const existingOrder = yield order_schema_1.default.findOne({ orderNumber });
            if (!existingOrder) {
                console.warn(`Order with number ${orderNumber} not found`);
                continue;
            }
            yield (0, order_model_1.updateAOrder)(existingOrder === null || existingOrder === void 0 ? void 0 : existingOrder._id, {
                orderNumber,
                items: updatedItems,
                deliveryStatus
            });
        }
        return res.json({
            status: "success",
            message: "All orders updated successfully!",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateMultipleOrderController = updateMultipleOrderController;
const updateProductsQuantities = (items) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedProducts = [];
    for (const item of items) {
        const productId = item.productId;
        const product = yield product_schema_1.default.findById(productId.toString());
        if (!product) {
            console.warn(`Product with ID ${productId} not found`);
            continue;
        }
        const suppliedQty = parseInt(item.supplied) || 0;
        const newQuantity = product.quantity - suppliedQty;
        product.quantity = newQuantity < 0 ? 0 : newQuantity;
        yield product.save();
        updatedProducts.push(product);
    }
});
