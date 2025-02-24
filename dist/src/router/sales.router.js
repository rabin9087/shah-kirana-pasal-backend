"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sales_controller_1 = require("../controller/sales.controller");
const router = (0, express_1.Router)();
router.get("/", sales_controller_1.getSaleAmountController);
router.get("/all", sales_controller_1.getAllSalesController);
exports.default = router;
