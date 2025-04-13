"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobCategory_controller_1 = require("../controller/jobCategory.controller");
const router = (0, express_1.Router)();
router.get("/", jobCategory_controller_1.getAllJobsCategoryController);
router.post("/", jobCategory_controller_1.createNewJobCategoryController);
exports.default = router;
