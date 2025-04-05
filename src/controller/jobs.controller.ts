import { NextFunction, Request, Response } from "express";
import { createJob } from "../model/jobs/jobs.model";

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