"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteACategoryByID = exports.updateCategoryByID = exports.getACategoryBySlug = exports.getACategoryByID = exports.getAllCategories = exports.createCategory = void 0;
const category_schema_1 = __importDefault(require("./category.schema"));
const createCategory = (categoryObj) => {
    return new category_schema_1.default(categoryObj).save();
};
exports.createCategory = createCategory;
const getAllCategories = () => {
    return category_schema_1.default.find();
};
exports.getAllCategories = getAllCategories;
const getACategoryByID = (_id) => {
    return category_schema_1.default.findById(_id);
};
exports.getACategoryByID = getACategoryByID;
const getACategoryBySlug = (slug) => {
    return category_schema_1.default.findOne({ slug });
};
exports.getACategoryBySlug = getACategoryBySlug;
const updateCategoryByID = (_id, categoryObj) => {
    return category_schema_1.default.findByIdAndUpdate(_id, categoryObj);
};
exports.updateCategoryByID = updateCategoryByID;
const deleteACategoryByID = (_id) => {
    return category_schema_1.default.findByIdAndDelete(_id);
};
exports.deleteACategoryByID = deleteACategoryByID;
