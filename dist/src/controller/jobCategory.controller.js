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
exports.getAllJobsCategoryController = exports.createNewJobCategoryController = void 0;
const jobCategory_model_1 = require("../model/jobCategory/jobCategory.model");
const createNewJobCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobCategory = yield (0, jobCategory_model_1.createJobCategory)(req.body);
        (jobCategory === null || jobCategory === void 0 ? void 0 : jobCategory._id)
            ? res.json({
                status: "success",
                message: "New jobCategory has been created successfully!",
                jobCategory
            })
            : res.json({
                status: "error",
                message: "Error creating new jobCategory.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.createNewJobCategoryController = createNewJobCategoryController;
const getAllJobsCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobCategories = yield (0, jobCategory_model_1.getAllJobsCategory)();
        (jobCategories === null || jobCategories === void 0 ? void 0 : jobCategories.length)
            ? res.json({
                status: "success",
                message: "Here are all available jobCategory",
                jobCategories
            })
            : res.json({
                status: "error",
                message: "Error geting jobCategory.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllJobsCategoryController = getAllJobsCategoryController;
