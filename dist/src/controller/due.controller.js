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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDueController = exports.createNewDueController = void 0;
const due_model_1 = require("../model/due/due.model");
const createNewDueController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const due = yield (0, due_model_1.createDue)(req.body);
        (due === null || due === void 0 ? void 0 : due._id)
            ? res.json({
                status: "success",
                message: "New due has been created successfully!",
                due
            })
            : res.json({
                status: "error",
                message: "Error creating new due.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.createNewDueController = createNewDueController;
const getUserDueController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const dues = yield (0, due_model_1.getDuesByUser)(userId);
        (dues === null || dues === void 0 ? void 0 : dues.length)
            ? res.json({
                status: "success",
                message: "Here are the dues for the user.",
                dues
            })
            : res.json({
                status: "error",
                message: "Error fetching user's due.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserDueController = getUserDueController;
