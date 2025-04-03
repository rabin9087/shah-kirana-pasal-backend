"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDuesByUser = exports.createDue = void 0;
const due_schema_1 = __importDefault(require("./due.schema"));
const createDue = (dueObj) => {
    return new due_schema_1.default(dueObj).save();
};
exports.createDue = createDue;
const getDuesByUser = (userId) => {
    return due_schema_1.default.find({ userId })
        .populate({
        path: "salesId",
        populate: {
            path: "items.productId",
        },
    })
        .populate("userId");
};
exports.getDuesByUser = getDuesByUser;
