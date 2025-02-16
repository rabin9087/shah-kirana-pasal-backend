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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateACategory = exports.deleteACategory = exports.getACategory = exports.getCategoriesList = exports.createNewCategory = void 0;
const category_model_1 = require("../model/category/category.model");
const slugify_1 = __importDefault(require("slugify"));
const createNewCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.slug = (0, slugify_1.default)(req.body.name, {
            replacement: '-',
            lower: true,
            trim: true
        });
        const { slug } = req.body;
        const slugValue = yield (0, category_model_1.getACategoryBySlug)(slug);
        if (slugValue === null || slugValue === void 0 ? void 0 : slugValue._id) {
            return res.json({
                status: "error",
                message: "Category already exist!",
            });
        }
        else {
            const category = yield (0, category_model_1.createCategory)(req.body);
            (category === null || category === void 0 ? void 0 : category._id)
                ? res.json({
                    status: "success",
                    message: "New Category has been created successfully!",
                })
                : res.json({
                    status: "error",
                    message: "Error creating new category.",
                });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createNewCategory = createNewCategory;
const getCategoriesList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryList = yield (0, category_model_1.getAllCategories)();
        (categoryList === null || categoryList === void 0 ? void 0 : categoryList.length)
            ? res.json({
                status: "success",
                message: "List of all categories",
                categoryList
            })
            : res.json({
                status: "error",
                message: "Error fetching category lists.",
            });
    }
    catch (error) {
    }
});
exports.getCategoriesList = getCategoriesList;
const getACategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const category = yield (0, category_model_1.getACategoryByID)(_id);
        (category === null || category === void 0 ? void 0 : category._id)
            ? res.json({
                status: "success",
                message: "Here is a category",
                category
            })
            : res.json({
                status: "error",
                message: "Error fetching a category.",
            });
    }
    catch (error) {
    }
});
exports.getACategory = getACategory;
const deleteACategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const deleteAcategory = yield (0, category_model_1.deleteACategoryByID)(_id);
        (deleteAcategory === null || deleteAcategory === void 0 ? void 0 : deleteAcategory._id)
            ? res.json({
                status: "success",
                message: "Catery has been deleted successfully",
            })
            : res.json({
                status: "error",
                message: "Error deleting a category.",
            });
    }
    catch (error) {
    }
});
exports.deleteACategory = deleteACategory;
const updateACategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { _id } = _a, categoryObj = __rest(_a, ["_id"]);
        console.log(req.body);
        const category = yield (0, category_model_1.updateCategoryByID)(_id, categoryObj);
        (category === null || category === void 0 ? void 0 : category._id)
            ? res.json({
                status: "success",
                message: "Catery has been updated successfully",
                category
            })
            : res.json({
                status: "error",
                message: "Error updating a category.",
                category
            });
    }
    catch (error) {
    }
});
exports.updateACategory = updateACategory;
