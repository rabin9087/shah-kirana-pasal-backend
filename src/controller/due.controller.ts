import { NextFunction, Request, Response } from "express";
import { createDue, getDuesByUser, updateDueAmountByID } from "../model/due/due.model";

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
            status: "success",
            message: "No deus available.",
          });
    } catch (error) {
      next(error);
    }
};

export const updateUserDueController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;
    const dues = await updateDueAmountByID(_id, req.body);
    console.log("This is dues return data: ", dues);

    if (dues?._id) {
      return res.json({
        status: "success",
        message: "Here are the dues for the user.",
        dues,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Error updaing user's due.",
      });
    }
  } catch (error) {
    next(error);
  }
};
