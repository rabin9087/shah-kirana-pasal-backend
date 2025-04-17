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

    const {_id} = req.params
    console.log(_id)
    const jobCategories = await getAllJobsCategory(_id)
        jobCategories?.length
        ? res.json({
            status: "success",
            message: "Here are all available jobCategory",
            jobCategories
          })
        : res.json({
            status: "error",
            message: "No jobCategory available.",
          });
    } catch (error) {
      next(error);
    }
};