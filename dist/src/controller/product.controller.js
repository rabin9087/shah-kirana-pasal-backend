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
exports.updateProductByID = exports.deleteProductByID = exports.updateAProductStatusController = exports.updateAProductController = exports.fetchAProductByQRCode = exports.fetchAProductByFilter = exports.fetchAProductByID = exports.getAllProductList = exports.createNewProduct = void 0;
const product_model_1 = require("../model/product/product.model");
const slugify_1 = __importDefault(require("slugify"));
const createNewProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.slug = (0, slugify_1.default)(req.body.name, {
            replacement: '-',
            lower: true,
            trim: true
        });
        const { sku, qrCodeNumber, slug } = req.body;
        const skuValue = yield (0, product_model_1.getAProductBySKU)(sku);
        const qrCode = yield (0, product_model_1.getAProductByQRCodeNumber)(qrCodeNumber);
        const slugValue = yield (0, product_model_1.getAProductByQRCodeNumber)(slug);
        if (skuValue === null || skuValue === void 0 ? void 0 : skuValue._id) {
            return res.json({
                status: "error",
                message: "SKU name already exist! \n Write different sku name",
            });
        }
        else if (qrCode === null || qrCode === void 0 ? void 0 : qrCode._id) {
            return res.json({
                status: "error",
                message: "QRCode value already exist! \n Enter different QRCode value",
            });
        }
        else if (slugValue === null || slugValue === void 0 ? void 0 : slugValue._id) {
            return res.json({
                status: "error",
                message: "Slug value already exist! \n Enter different Slug value",
            });
        }
        else {
            const product = yield (0, product_model_1.createProduct)(req.body);
            (product === null || product === void 0 ? void 0 : product._id)
                ? res.json({
                    status: "success",
                    message: "New Product has been created successfully!",
                })
                : res.json({
                    status: "error",
                    message: "Error creating new product.",
                });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createNewProduct = createNewProduct;
const getAllProductList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, product_model_1.getAllProducts)();
        (products === null || products === void 0 ? void 0 : products.length)
            ? res.json({
                status: "success",
                message: "Here is list of all products!",
                products
            })
            : res.json({
                status: "error",
                message: "Error fetching product.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllProductList = getAllProductList;
const fetchAProductByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const product = yield (0, product_model_1.getAProductByID)(_id);
        (product === null || product === void 0 ? void 0 : product._id)
            ? res.json({
                status: "success",
                message: "Here is a product!",
                product
            })
            : res.json({
                status: "error",
                message: "Error fetching product.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.fetchAProductByID = fetchAProductByID;
const fetchAProductByFilter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield (0, product_model_1.getAProductByFilter)(req.query);
        (product === null || product === void 0 ? void 0 : product._id)
            ? res.json({
                status: "success",
                message: "Here is a product!",
                product
            })
            : res.json({
                status: "error",
                message: "Product Not Found!",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.fetchAProductByFilter = fetchAProductByFilter;
const fetchAProductByQRCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.params;
        console.log(code);
        const product = yield (0, product_model_1.getAProductByQRCodeNumber)({ qrCodeNumber: code });
        (product === null || product === void 0 ? void 0 : product._id)
            ? res.json({
                status: "success",
                message: "Here is a product!",
                product
            })
            : res.json({
                status: "error",
                message: "Product Not Found1",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.fetchAProductByQRCode = fetchAProductByQRCode;
const updateAProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.slug = (0, slugify_1.default)(req.body.name, {
            replacement: '-',
            lower: true,
            trim: true
        });
        const { _id } = req.params;
        const product = yield (0, product_model_1.updateAProductByID)(_id, req.body);
        (product === null || product === void 0 ? void 0 : product._id)
            ? res.json({
                status: "success",
                message: "Product has been Updated successfully!",
                product
            })
            : res.json({
                status: "error",
                message: "Error updating product.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.updateAProductController = updateAProductController;
const updateAProductStatusController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const { status } = req.body;
        const product = yield (0, product_model_1.getAProductByFilter)({ _id, status });
        (product === null || product === void 0 ? void 0 : product._id)
            ? res.json({
                status: "success",
                message: "Product has been Updated successfully!",
            })
            : res.json({
                status: "error",
                message: "Error updating product.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.updateAProductStatusController = updateAProductStatusController;
const deleteProductByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const product = yield (0, product_model_1.deleteAProductByID)(_id);
        (product === null || product === void 0 ? void 0 : product._id)
            ? res.json({
                status: "success",
                message: "Product has been deleted successfully!",
                product
            })
            : res.json({
                status: "error",
                message: "Error deleting product.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProductByID = deleteProductByID;
const updateProductByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { _id } = _a, rest = __rest(_a, ["_id"]);
        const product = yield (0, product_model_1.updateAProduct)(_id, Object.assign({}, rest));
        (product === null || product === void 0 ? void 0 : product.matchedCount)
            ? res.json({
                status: "success",
                message: "Product has been updated successfully!",
                product
            })
            : res.json({
                status: "error",
                message: "Error updating product.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.updateProductByID = updateProductByID;
