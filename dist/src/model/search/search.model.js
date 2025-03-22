"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchUserResults = exports.getSearchProductResults = void 0;
const product_schema_1 = __importDefault(require("../product/product.schema"));
const user_schema_1 = __importDefault(require("../user/user.schema"));
const getSearchProductResults = (searchTerm) => {
    return product_schema_1.default.find({
        $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { alternateName: { $regex: searchTerm, $options: "i" } }
        ]
    });
};
exports.getSearchProductResults = getSearchProductResults;
const getSearchUserResults = (searchTerm) => {
    return user_schema_1.default.find({
        $or: [
            { fName: { $regex: searchTerm, $options: "i" } },
            { lName: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
            { phone: { $regex: searchTerm, $options: "i" } },
        ]
    });
};
exports.getSearchUserResults = getSearchUserResults;
