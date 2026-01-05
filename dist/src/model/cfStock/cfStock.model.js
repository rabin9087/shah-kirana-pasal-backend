"use strict";
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
exports.deleteAOrderByID = exports.updateOrderStatusByID = exports.updateAOrderByID = exports.getAOrderByStoredAT = exports.getAOrderBySlug = exports.getAOrdersByDate = exports.getAOrderByQRCodeNumber = exports.getAOrderByOrderNumber = exports.getAOrderByFilter = exports.getAOrderBySKU = exports.updateStockByIdentifier = exports.getStockByIdentifier = exports.getStockByLocationTypes = exports.getStockesByLocation = exports.getStockesBySKU = exports.getAllStock = exports.insertBulkSTOCK = exports.createSTOCK = void 0;
const cfStock_Schema_1 = __importDefault(require("./cfStock.Schema"));
const createSTOCK = (StockObj) => {
    return new cfStock_Schema_1.default(StockObj).save();
};
exports.createSTOCK = createSTOCK;
const insertBulkSTOCK = (stockArr) => {
    return cfStock_Schema_1.default.insertMany(stockArr);
};
exports.insertBulkSTOCK = insertBulkSTOCK;
const getAllStock = () => {
    return cfStock_Schema_1.default.find();
};
exports.getAllStock = getAllStock;
const getStockesBySKU = (sku) => {
    return cfStock_Schema_1.default.find({ sku });
};
exports.getStockesBySKU = getStockesBySKU;
const getStockesByLocation = (location) => {
    return cfStock_Schema_1.default.find({ location });
};
exports.getStockesByLocation = getStockesByLocation;
const getStockByLocationTypes = (locationType) => {
    return cfStock_Schema_1.default.find({ locationType });
};
exports.getStockByLocationTypes = getStockByLocationTypes;
const getStockByIdentifier = (identifier) => {
    return cfStock_Schema_1.default.findOne({ identifier });
};
exports.getStockByIdentifier = getStockByIdentifier;
const updateStockByIdentifier = (identifier, quantity, locationType) => {
    return cfStock_Schema_1.default.findOneAndUpdate({ identifier }, { quantity, locationType });
};
exports.updateStockByIdentifier = updateStockByIdentifier;
const getAOrderBySKU = (sku) => {
    return cfStock_Schema_1.default.findOne({ sku });
};
exports.getAOrderBySKU = getAOrderBySKU;
const getAOrderByFilter = (filter) => {
    return cfStock_Schema_1.default.findOne(filter).populate('items.productId');
};
exports.getAOrderByFilter = getAOrderByFilter;
const getAOrderByOrderNumber = (filter) => {
    return cfStock_Schema_1.default.find(filter);
};
exports.getAOrderByOrderNumber = getAOrderByOrderNumber;
const getAOrderByQRCodeNumber = (_a) => {
    var qrCodeNumber = __rest(_a, []);
    return cfStock_Schema_1.default.findOne(qrCodeNumber);
};
exports.getAOrderByQRCodeNumber = getAOrderByQRCodeNumber;
const getAOrdersByDate = (requestDeliveryDate) => {
    return cfStock_Schema_1.default.find({ requestDeliveryDate }).populate('items.productId');
};
exports.getAOrdersByDate = getAOrdersByDate;
const getAOrderBySlug = (slug) => {
    return cfStock_Schema_1.default.findOne({ slug });
};
exports.getAOrderBySlug = getAOrderBySlug;
const getAOrderByStoredAT = (storedAt) => {
    return cfStock_Schema_1.default.findOne({ storedAt });
};
exports.getAOrderByStoredAT = getAOrderByStoredAT;
const updateAOrderByID = (_id, OrderObj) => {
    return cfStock_Schema_1.default.findByIdAndUpdate(_id, OrderObj);
};
exports.updateAOrderByID = updateAOrderByID;
const updateOrderStatusByID = (orderNumber, OrderObj) => {
    return cfStock_Schema_1.default.findByIdAndUpdate(orderNumber, OrderObj);
};
exports.updateOrderStatusByID = updateOrderStatusByID;
const deleteAOrderByID = (_id) => {
    return cfStock_Schema_1.default.findByIdAndDelete(_id);
};
exports.deleteAOrderByID = deleteAOrderByID;
