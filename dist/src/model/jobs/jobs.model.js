"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAJob = exports.getAllJobs = exports.createJob = void 0;
const jobs_schema_1 = __importDefault(require("./jobs.schema"));
const createJob = (data) => {
    return new jobs_schema_1.default(data).save();
};
exports.createJob = createJob;
const getAllJobs = () => {
    return jobs_schema_1.default.find();
};
exports.getAllJobs = getAllJobs;
const updateAJob = (_id) => {
    return jobs_schema_1.default.findOneAndUpdate({ _id });
};
exports.updateAJob = updateAJob;
