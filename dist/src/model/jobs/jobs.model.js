"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAJob = exports.updateAJobPayment = exports.getAllJobs = exports.createJob = void 0;
const jobs_schema_1 = __importDefault(require("./jobs.schema"));
const createJob = (data) => {
    return new jobs_schema_1.default(data).save();
};
exports.createJob = createJob;
const getAllJobs = () => {
    return jobs_schema_1.default.find();
};
exports.getAllJobs = getAllJobs;
const updateAJobPayment = (_id, newPayment) => {
    return jobs_schema_1.default.findOneAndUpdate({ _id }, {
        $push: {
            newPayment: newPayment,
        },
    }, { new: true });
};
exports.updateAJobPayment = updateAJobPayment;
const updateAJob = (_id, data) => {
    return jobs_schema_1.default.findOneAndUpdate({ _id }, { $set: Object.assign({}, data) }, { new: true });
};
exports.updateAJob = updateAJob;
