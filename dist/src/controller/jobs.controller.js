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
exports.upadateAJobController = exports.upadateJobPaymentController = exports.getAllJobsController = exports.createNewJobController = void 0;
const jobs_model_1 = require("../model/jobs/jobs.model");
const createNewJobController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = yield (0, jobs_model_1.createJob)(req.body);
        (job === null || job === void 0 ? void 0 : job._id)
            ? res.json({
                status: "success",
                message: "New job has been created successfully!",
                job
            })
            : res.json({
                status: "error",
                message: "Error creating new job.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.createNewJobController = createNewJobController;
const getAllJobsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const jobs = yield (0, jobs_model_1.getAllJobs)(_id);
        (jobs === null || jobs === void 0 ? void 0 : jobs.length)
            ? res.json({
                status: "success",
                message: "Here are all available jobs",
                jobs
            })
            : res.json({
                status: "error",
                message: "Error geting jobs.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllJobsController = getAllJobsController;
const upadateJobPaymentController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const job = yield (0, jobs_model_1.updateAJobPayment)(_id, req.body);
        (job === null || job === void 0 ? void 0 : job._id)
            ? res.json({
                status: "success",
                message: "New payment bas been updateed successfully!",
                job
            })
            : res.json({
                status: "error",
                message: "Error updating new payment.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.upadateJobPaymentController = upadateJobPaymentController;
const upadateAJobController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const job = yield (0, jobs_model_1.updateAJob)(_id, req.body);
        (job === null || job === void 0 ? void 0 : job._id)
            ? res.json({
                status: "success",
                message: "New payment bas been updateed successfully!",
                job
            })
            : res.json({
                status: "error",
                message: "Error updating new payment.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.upadateAJobController = upadateAJobController;
