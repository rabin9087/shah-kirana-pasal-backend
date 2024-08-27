"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_router_1 = __importDefault(require("../router/user.router"));
const category_router_1 = __importDefault(require("../router/category.router"));
const product_router_1 = __importDefault(require("../router/product.router"));
const payment_router_1 = __importDefault(require("../router/payment.router"));
const router = express_1.default.Router();
router.use("/user", user_router_1.default);
router.use("/category", category_router_1.default);
router.use("/product", product_router_1.default);
router.use("/payment", payment_router_1.default);
exports.default = router;
