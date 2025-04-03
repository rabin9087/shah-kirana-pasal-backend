import DueSchema, { IDue } from "./due.schema";

export const createDue = (dueObj: IDue) => {
  return new DueSchema(dueObj).save();
};

export const getDuesByUser = (userId: string) => {
  return DueSchema.find({ userId })
    .populate({
        path: "salesId",
        populate: {
            path: "items.productId", // Populate productId inside sales.items
            // Ensure the correct model name
        },
    })
    .populate("userId");
};