import { NextFunction, Request, Response } from "express";
import { createDue, getDuesByUser } from "../model/due/due.model";

export const createNewDueController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {

    const due = await createDue(req.body)
        due?._id
        ? res.json({
            status: "success",
            message: "New due has been created successfully!",
            due
          })
        : res.json({
            status: "error",
            message: "Error creating new due.",
          });
    } catch (error) {
      next(error);
    }
};

export const getUserDueController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {

      const { userId } = req.params;
      const dues = await getDuesByUser(userId);
        dues?.length
        ? res.json({
            status: "success",
            message: "Here are the dues for the user.",
            dues
          })
        : res.json({
            status: "error",
            message: "Error fetching user's due.",
          });
    } catch (error) {
      next(error);
    }
};