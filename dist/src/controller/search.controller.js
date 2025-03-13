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
exports.searchNewItem = void 0;
const search_model_1 = require("../model/search/search.model");
const searchNewItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm } = req.query;
        if (!searchTerm) {
            return res.status(400).json({ message: "Search term is required" });
        }
        const products = yield (0, search_model_1.getSearchResults)(searchTerm);
        (products === null || products === void 0 ? void 0 : products.length)
            ? res.json({
                status: "success",
                message: "Here are all searched products",
                result: products.map(({ _id, name, alternateName, parentCategoryID }) => ({ name, _id, alternateName, parentCategoryID }))
            })
            : res.json({
                status: "success",
                message: "Product not found.",
                result: []
            });
    }
    catch (error) {
        next();
    }
});
exports.searchNewItem = searchNewItem;
