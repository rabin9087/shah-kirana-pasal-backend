"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const due_controller_1 = require("../controller/due.controller");
const router = (0, express_1.Router)();
router.post("/", due_controller_1.createNewDueController);
router.get("/:userId", due_controller_1.getUserDueController);
exports.default = router;
