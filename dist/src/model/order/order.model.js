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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAOrderByID = exports.updateAOrder = exports.updateOrderStatusByID = exports.updateAOrderByID = exports.getAOrderByStoredAT = exports.getAOrderBySlug = exports.getAOrdersByDate = exports.getAOrderByQRCodeNumber = exports.getAOrderByOrderNumber = exports.getAOrderByFilter = exports.getAOrderBySKU = exports.getOrderListBystatus = exports.getOrderListBySlug = exports.getOrderListByCategory = exports.getAOrderByID = exports.getOrderListByName = exports.getAllOrders = exports.createOrder = void 0;
const order_schema_1 = __importDefault(require("./order.schema"));
const createOrder = (OrderObj) => {
    return new order_schema_1.default(OrderObj).save();
};
exports.createOrder = createOrder;
const getAllOrders = () => {
    return order_schema_1.default.find().populate('items.productId');
};
exports.getAllOrders = getAllOrders;
const getOrderListByName = (name) => {
    return order_schema_1.default.find({ name });
};
exports.getOrderListByName = getOrderListByName;
const getAOrderByID = (_id) => {
    return order_schema_1.default.findById(_id);
};
exports.getAOrderByID = getAOrderByID;
const getOrderListByCategory = (parentCategoryID) => {
    return order_schema_1.default.find({ parentCategoryID });
};
exports.getOrderListByCategory = getOrderListByCategory;
const getOrderListBySlug = (slug) => {
    return order_schema_1.default.find({ slug });
};
exports.getOrderListBySlug = getOrderListBySlug;
const getOrderListBystatus = (status) => {
    return order_schema_1.default.find({ status });
};
exports.getOrderListBystatus = getOrderListBystatus;
const getAOrderBySKU = (sku) => {
    return order_schema_1.default.findOne({ sku });
};
exports.getAOrderBySKU = getAOrderBySKU;
const getAOrderByFilter = (filter) => {
    return order_schema_1.default.findOne(filter).populate('items.productId');
};
exports.getAOrderByFilter = getAOrderByFilter;
const getAOrderByOrderNumber = (filter) => {
    return order_schema_1.default.find(filter);
};
exports.getAOrderByOrderNumber = getAOrderByOrderNumber;
const getAOrderByQRCodeNumber = (_a) => {
    var qrCodeNumber = __rest(_a, []);
    return order_schema_1.default.findOne(qrCodeNumber);
};
exports.getAOrderByQRCodeNumber = getAOrderByQRCodeNumber;
const getAOrdersByDate = (requestDeliveryDate) => {
    return order_schema_1.default.find({ requestDeliveryDate }).populate('items.productId');
};
exports.getAOrdersByDate = getAOrdersByDate;
const getAOrderBySlug = (slug) => {
    return order_schema_1.default.findOne({ slug });
};
exports.getAOrderBySlug = getAOrderBySlug;
const getAOrderByStoredAT = (storedAt) => {
    return order_schema_1.default.findOne({ storedAt });
};
exports.getAOrderByStoredAT = getAOrderByStoredAT;
const updateAOrderByID = (_id, OrderObj) => {
    return order_schema_1.default.findByIdAndUpdate(_id, OrderObj);
};
exports.updateAOrderByID = updateAOrderByID;
const updateOrderStatusByID = (orderNumber, OrderObj) => {
    return order_schema_1.default.findByIdAndUpdate(orderNumber, OrderObj);
};
exports.updateOrderStatusByID = updateOrderStatusByID;
const updateAOrder = (_id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_schema_1.default.findById(_id);
    if (!order)
        return null;
    if (data.items && Array.isArray(data.items)) {
        const updateMap = new Map();
        for (const { productId, supplied } of data.items) {
            updateMap.set(productId.toString(), supplied);
        }
        order.items = order.items.map((item) => {
            const key = item.productId.toString();
            if (updateMap.has(key)) {
                item.supplied = updateMap.get(key);
            }
            return item;
        });
        delete data.items;
    }
    Object.assign(order, data);
    yield order.save();
    return order;
});
exports.updateAOrder = updateAOrder;
const deleteAOrderByID = (_id) => {
    return order_schema_1.default.findByIdAndDelete(_id);
};
exports.deleteAOrderByID = deleteAOrderByID;
