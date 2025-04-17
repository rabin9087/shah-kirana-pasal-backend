import { NextFunction, Request, Response } from "express";
import { createJob, getAllJobs, updateAJob, updateAJobPayment } from "../model/jobs/jobs.model";

export const createNewJobController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {

    const job = await createJob(req.body)
        job?._id
        ? res.json({
            status: "success",
            message: "New job has been created successfully!",
            job
          })
        : res.json({
            status: "error",
            message: "Error creating new job.",
          });
    } catch (error) {
      next(error);
    }
};

export const getAllJobsController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {
    const {_id} = req.params
    const jobs = await getAllJobs(_id)
        jobs?.length
        ? res.json({
            status: "success",
            message: "Here are all available jobs",
            jobs
          })
        : res.json({
            status: "error",
            message: "No jobs available.",
          });
    } catch (error) {
      next(error);
    }
};

export const upadateJobPaymentController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {
      const { _id } = req.params
      
    const job = await updateAJobPayment(_id, req.body)
         job?._id
        ? res.json({
            status: "success",
            message: "New payment bas been updateed successfully!",
            job
          })
        : res.json({
            status: "error",
            message: "Error updating new payment.",
          });
    } catch (error) {
      next(error);
    }
};

export const upadateAJobController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {
      const { _id } = req.params
      
    const job = await updateAJob(_id, req.body)
         job?._id
        ? res.json({
            status: "success",
            message: "New payment bas been updateed successfully!",
            job
          })
        : res.json({
            status: "error",
            message: "Error updating new payment.",
          });
    } catch (error) {
      next(error);
    }
};