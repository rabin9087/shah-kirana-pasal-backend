import { createUserParams } from "../../../types";
import userSchema, { IAddToCartTypes, ICartHistory } from "./user.schema";

export const createUser = (userObj: createUserParams) => {
  return new userSchema(userObj).save();
};

export const getAllUser = () => {
  return userSchema.find();
};
export const getUserByPhoneOrEmail = async (email_phone: string) => {
  return await userSchema
    .findOne({ $or: [{ email: email_phone }, { phone: email_phone }] })
    .populate("cart.productId") // Populate product in cart
    .populate("cartHistory.items.productId"); // Path to populate cartHistory items
};

export const UpdateUserByPhone = (phone: string, data: object) => {
  return userSchema.findOneAndUpdate({ phone }, { $set: data }, { new: true });
};

export const UpdateUserCartHistoryByPhone = (
  phone: string,
  data: { items: any[] },
  amount: number,
  orderNumber: number
) => {
  return userSchema.findOneAndUpdate(
    { phone },
    { 
      $push: { 
        cartHistory: { 
          $each: [{ items: data.items, amount, purchasedAt: new Date() , orderNumber}], 
          $position: 0 // Inserts at index 0
        } 
      } 
    },
    { new: true, upsert: true }
  );
};



export const getUserByPhoneAndJWT = (obj: {
  phone: string;
  refreshJWT: string;
}) => {
  return userSchema.findOne(obj);
};
