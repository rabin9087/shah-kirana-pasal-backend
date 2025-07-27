"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shop_controller_1 = require("../controller/shop.controller");
const awsUpload_1 = require("../utils/awsUpload");
const router = (0, express_1.Router)();
const uploadMiddlewareLogo = awsUpload_1.upload.fields([
    { name: "logo", maxCount: 1 },
]);
router.post("/", uploadMiddlewareLogo, shop_controller_1.createNewShopController);
router.get("/", shop_controller_1.getAllShopController);
exports.default = router;
