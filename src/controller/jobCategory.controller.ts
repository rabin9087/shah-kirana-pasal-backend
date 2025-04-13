import { NextFunction, Request, Response } from "express";
import { createJobCategory, getAllJobsCategory } from "../model/jobCategory/jobCategory.model";

export const createNewJobCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {

    const jobCategory = await createJobCategory(req.body)
        jobCategory?._id
        ? res.json({
            status: "success",
            message: "New jobCategory has been created successfully!",
            jobCategory
          })
        : res.json({
            status: "error",
            message: "Error creating new jobCategory.",
          });
    } catch (error) {
      next(error);
    }
};

export const getAllJobsCategoryController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {

    const jobCategories = await getAllJobsCategory()
        jobCategories?.length
        ? res.json({
            status: "success",
            message: "Here are all available jobCategory",
            jobCategories
          })
        : res.json({
            status: "error",
            message: "Error geting jobCategory.",
          });
    } catch (error) {
      next(error);
    }
};