"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controller/product.controller");
const awsUpload_1 = require("../utils/awsUpload");
const product_model_1 = require("../model/product/product.model");
const router = (0, express_1.Router)();
const uploadMiddleware = awsUpload_1.upload.fields([
    { name: "images", maxCount: 10 },
    { name: "thumbnail", maxCount: 1 },
]);
const updateUploadMiddleware = awsUpload_1.upload.fields([
    { name: "addImages", maxCount: 10 },
    { name: "newThumbnail", maxCount: 1 },
]);
router.post("/", uploadMiddleware, product_controller_1.createNewProduct);
router.get("/q", product_controller_1.fetchAProductByFilter);
router.get("/q=:code", product_controller_1.fetchAProductByQRCode);
router.get("/:_id", product_controller_1.fetchAProductByID);
router.get("/category/:slug", product_controller_1.getAllProductListByCategory);
router.get("/", product_controller_1.getAllProductList);
router.get("/", product_model_1.getAllActiveProducts);
router.delete("/:_id", product_controller_1.deleteProductByID);
router.put("/:_id", updateUploadMiddleware, product_controller_1.updateAProductController);
router.patch("/:_id", product_controller_1.updateAProductStatusController);
exports.default = router;
