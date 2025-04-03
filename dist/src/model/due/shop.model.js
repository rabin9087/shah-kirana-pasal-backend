"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShop = void 0;
const due_schema_1 = __importDefault(require("./due.schema"));
const createShop = (shopObj) => {
    return new due_schema_1.default(shopObj).save();
};
exports.createShop = createShop;
