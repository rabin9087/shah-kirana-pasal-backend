"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobs_controller_1 = require("../controller/jobs.controller");
const router = (0, express_1.Router)();
router.post("/", jobs_controller_1.createNewJobController);
exports.default = router;
