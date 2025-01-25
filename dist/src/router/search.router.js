"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = require("../controller/search.controller");
const router = (0, express_1.Router)();
router.get("/products", search_controller_1.searchNewItem);
exports.default = router;
