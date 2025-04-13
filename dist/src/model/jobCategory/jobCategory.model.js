"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllJobsCategory = exports.createJobCategory = void 0;
const jobCategory_schema_1 = __importDefault(require("./jobCategory.schema"));
const createJobCategory = (data) => {
    return new jobCategory_schema_1.default(data).save();
};
exports.createJobCategory = createJobCategory;
const getAllJobsCategory = () => {
    return jobCategory_schema_1.default.find();
};
exports.getAllJobsCategory = getAllJobsCategory;
