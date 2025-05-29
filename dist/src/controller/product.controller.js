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
exports.updateProductByID = exports.deleteProductByID = exports.updateAProductStatusController = exports.updateAProductController = exports.fetchAProductBySKUController = exports.fetchAProductByQRCode = exports.fetchAProductByFilter = exports.fetchAProductByID = exports.getAllProductListByCategory = exports.getAllProductList = exports.getAllProductListByLimit = exports.updateProductThumbnail = exports.createNewProduct = void 0;
const product_model_1 = require("../model/product/product.model");
const slugify_1 = __importDefault(require("slugify"));
const category_model_1 = require("../model/category/category.model");
const product_schema_1 = __importDefault(require("../model/product/product.schema"));
const redis_1 = require("../utils/redis");
const createNewProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.files) {
            const files = req.files;
            if (files["images"]) {
                req.body.images = files["images"].map(item => item.location);
            }
            if (files["thumbnail"]) {
                req.body.thumbnail = files["thumbnail"][0].location;
            }
        }
        req.body.slug = (0, slugify_1.default)(req.body.name, {
            replacement: '-',
            lower: true,
            trim: true
        });
        const { sku, qrCodeNumber, slug } = req.body;
        const generateRandomSKU = () => {
            return Math.floor(Math.random() * (9999999 - 100 + 1)) + 100;
        };
        let newSku = sku;
        let skuExists = yield (0, product_model_1.getAProductBySKU)(newSku);
        while (skuExists === null || skuExists === void 0 ? void 0 : skuExists._id) {
            newSku = generateRandomSKU().toString();
            skuExists = yield (0, product_model_1.getAProductBySKU)(newSku);
        }
        const qrCode = yield (0, product_model_1.getAProductByQRCodeNumber)(qrCodeNumber);
        const slugValue = yield (0, product_model_1.getAProductByQRCodeNumber)(slug);
        if (qrCode === null || qrCode === void 0 ? void 0 : qrCode._id) {
            return res.json({
                status: "error",
                message: "QRCode value already exist! \n Enter different QRCode value",
            });
        }
        else if (slugValue === null || slugValue === void 0 ? void 0 : slugValue._id) {
            return res.json({
                status: "error",
                message: "Slug already exist! \n Enter different Slug value",
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
const updateProductThumbnail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.files) {
            const files = req.files;
            if (files["thumbnail"]) {
                req.body.thumbnail = files["thumbnail"][0].location;
            }
            const { _id } = req.params;
            const product = yield (0, product_model_1.updateAProductThumbnailByID)(_id, req.body);
            (product === null || product === void 0 ? void 0 : product._id)
                ? res.json({
                    status: "success",
                    message: "Product thumbnail has been Updated successfully!",
                    product
                })
                : res.json({
                    status: "error",
                    message: "Error updating product's Thumbnail.",
                });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateProductThumbnail = updateProductThumbnail;
const getAllProductListByLimit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;
        const search = req.query.search || "";
        const sortBy = req.query.sortBy || "createdAt";
        const order = req.query.order === "asc" ? 1 : -1;
        const cacheKey = `products:page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&order=${order}`;
        const cachedData = yield redis_1.redisClient.get(cacheKey);
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }
        const query = {};
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }
        const total = yield product_schema_1.default.countDocuments(query);
        const products = yield product_schema_1.default
            .find(query)
            .sort({ [sortBy]: order })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
        const filteredProducts = products
            .map((_a) => {
            var { costPrice } = _a, rest = __rest(_a, ["costPrice"]);
            return rest;
        })
            .filter((item) => item.status === "ACTIVE");
        const responseData = {
            status: "success",
            message: "Products fetched successfully!",
            products: filteredProducts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
        yield redis_1.redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 300 });
        res.json(responseData);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllProductListByLimit = getAllProductListByLimit;
const getAllProductList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = `allProducts`;
        const cachedData = yield redis_1.redisClient.get(cacheKey);
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }
        const products = yield (0, product_model_1.getAllProducts)();
        if (products === null || products === void 0 ? void 0 : products.length) {
            const responseData = {
                status: "success",
                message: "Here is list of all products!",
                products,
            };
            yield redis_1.redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 300 });
            return res.json(responseData);
        }
        else {
            return res.json({
                status: "error",
                message: "Error fetching product.",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getAllProductList = getAllProductList;
const getAllProductListByCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const cacheKey = `products:category:${slug}`;
        const cachedData = yield redis_1.redisClient.get(cacheKey);
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }
        const cat = yield (0, category_model_1.getACategoryBySlug)(slug);
        if (cat === null || cat === void 0 ? void 0 : cat._id) {
            const products = yield (0, product_model_1.getProductListByCategory)(cat._id);
            const activeProducts = products === null || products === void 0 ? void 0 : products.filter(item => item.status === "ACTIVE");
            const response = activeProducts.length
                ? {
                    status: "success",
                    message: "Here is list of all products!",
                    products: activeProducts,
                }
                : {
                    status: "error",
                    message: "No active products found for this category.",
                };
            yield redis_1.redisClient.setEx(cacheKey, 60, JSON.stringify(response));
            return res.json(response);
        }
        else {
            res.json({
                status: "error",
                message: `No products available for category: ${slug}`,
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getAllProductListByCategory = getAllProductListByCategory;
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
        const product = yield (0, product_model_1.getAProductByQRCodeNumber)({ qrCodeNumber: code });
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
exports.fetchAProductByQRCode = fetchAProductByQRCode;
const fetchAProductBySKUController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sku } = req.params;
        const product = yield (0, product_model_1.getAProductBySKU)(sku);
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
exports.fetchAProductBySKUController = fetchAProductBySKUController;
const updateAProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { images } = req.body;
        let oldImages = [];
        try {
            oldImages = JSON.parse(images);
            if (req.files) {
                const files = req.files;
                if (files["addImages"]) {
                    const newImages = files["addImages"].map(item => item.location);
                    req.body.images = [...newImages, ...oldImages];
                }
                if (files["newThumbnail"]) {
                    req.body.thumbnail = files["newThumbnail"][0].location;
                }
            }
            else {
                req.body.images = JSON.parse(images);
            }
        }
        catch (error) {
        }
        const { _id } = req.body;
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
        const product = yield (0, product_model_1.updateAProductStatusByID)({ _id, status });
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
        const { _id } = req.params;
        const rest = __rest(req.body, []);
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
