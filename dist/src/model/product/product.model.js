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
exports.deleteAProductByID = exports.updateAProduct = exports.updateAProductThumbnailByID = exports.updateAProductByID = exports.getAProductByStoredAT = exports.getAProductBySlug = exports.getAProductByQRCodeNumber = exports.updateAProductStatusByID = exports.getAProductByFilter = exports.getAProductBySKU = exports.getProductListBystatus = exports.getProductListBySlug = exports.getProductListByCategory = exports.getAProductByID = exports.getProductListByName = exports.getAllActiveProducts = exports.getAllProducts = exports.createProduct = void 0;
const product_schema_1 = __importDefault(require("./product.schema"));
const createProduct = (productObj) => {
    return new product_schema_1.default(productObj).save();
};
exports.createProduct = createProduct;
const getAllProducts = () => {
    return product_schema_1.default.find();
};
exports.getAllProducts = getAllProducts;
const getAllActiveProducts = () => {
    return product_schema_1.default.find({ status: "ACTIVE" });
};
exports.getAllActiveProducts = getAllActiveProducts;
const getProductListByName = (name) => {
    return product_schema_1.default.find({ name });
};
exports.getProductListByName = getProductListByName;
const getAProductByID = (_id) => {
    return product_schema_1.default.findById(_id);
};
exports.getAProductByID = getAProductByID;
const getProductListByCategory = (parentCategoryID) => {
    return product_schema_1.default.find({ parentCategoryID });
};
exports.getProductListByCategory = getProductListByCategory;
const getProductListBySlug = (slug) => {
    return product_schema_1.default.find({ slug });
};
exports.getProductListBySlug = getProductListBySlug;
const getProductListBystatus = (status) => {
    return product_schema_1.default.find({ status });
};
exports.getProductListBystatus = getProductListBystatus;
const getAProductBySKU = (sku) => {
    return product_schema_1.default.findOne({ sku });
};
exports.getAProductBySKU = getAProductBySKU;
const getAProductByFilter = (filter) => {
    return product_schema_1.default.findOne(filter);
};
exports.getAProductByFilter = getAProductByFilter;
const updateAProductStatusByID = ({ _id, status }) => {
    return product_schema_1.default.findOneAndUpdate({ _id }, { status }, { new: true });
};
exports.updateAProductStatusByID = updateAProductStatusByID;
const getAProductByQRCodeNumber = (_a) => {
    var qrCodeNumber = __rest(_a, []);
    return product_schema_1.default.findOne(qrCodeNumber);
};
exports.getAProductByQRCodeNumber = getAProductByQRCodeNumber;
const getAProductBySlug = (slug) => {
    return product_schema_1.default.findOne({ slug });
};
exports.getAProductBySlug = getAProductBySlug;
const getAProductByStoredAT = (storedAt) => {
    return product_schema_1.default.findOne({ storedAt });
};
exports.getAProductByStoredAT = getAProductByStoredAT;
const updateAProductByID = (_id, productObj) => {
    return product_schema_1.default.findByIdAndUpdate(_id, productObj);
};
exports.updateAProductByID = updateAProductByID;
const updateAProductThumbnailByID = (_id, productObj) => {
    return product_schema_1.default.findByIdAndUpdate(_id, productObj);
};
exports.updateAProductThumbnailByID = updateAProductThumbnailByID;
const updateAProduct = (_id, _a) => {
    var productObj = __rest(_a, []);
    return product_schema_1.default.updateOne({ _id }, Object.assign({}, productObj));
};
exports.updateAProduct = updateAProduct;
const deleteAProductByID = (_id) => {
    return product_schema_1.default.findByIdAndDelete(_id);
};
exports.deleteAProductByID = deleteAProductByID;
