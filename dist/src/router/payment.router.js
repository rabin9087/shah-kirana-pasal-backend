"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controller/payment.controller");
const router = (0, express_1.Router)();
router.post("/create-payment-intent", payment_controller_1.createPayment);
exports.default = router;
