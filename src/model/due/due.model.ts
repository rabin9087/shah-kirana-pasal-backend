import DueSchema, { IDue } from "./due.schema";

export const createDue = (dueObj: IDue) => {
  return new DueSchema(dueObj).save();
};

export const getDuesByUser = (userId: string) => {
  return DueSchema.find({ userId, isActive: true })
    .populate({
      path: "salesId",
      populate: {
        path: "items.productId", // Populate productId inside sales.items
      },
    })
    .populate({
      path: "userId",
      select: "-password -refreshJWT -verificationCode -__v -cart -cartHistory", // exclude these fields
    });
};

export const updateDueAmountByID = (
  _id: string,
  due: Partial<Pick<IDue, "dueAmount" | "duePaymentStatus" | "isActive">> & { paymentHistory: { paymentMethod: string; amount: number; paymentDate: Date } }
) => {
  const { paymentHistory, ...rest } = due;
  return DueSchema.findByIdAndUpdate(
    _id,
    {
      $set: { ...rest },
      $push: { paymentHistory: {paymentMethod: paymentHistory.paymentMethod, amount: paymentHistory.amount, paymentDate: new Date()} },
    },
    { new: true }
  );
};

