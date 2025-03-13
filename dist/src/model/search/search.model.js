"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchResults = void 0;
const product_schema_1 = __importDefault(require("../product/product.schema"));
const getSearchResults = (searchTerm) => {
    return product_schema_1.default.find({
        $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { alternateName: { $regex: searchTerm, $options: "i" } }
        ]
    });
};
exports.getSearchResults = getSearchResults;
