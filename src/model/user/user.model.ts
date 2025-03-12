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

export const UpdateUserByPhone = (phone: string, data: { refreshJWT?: string } & Record<string, any>) => {
  const updateQuery: Record<string, any> = { $set: { ...data } };

  if (data.refreshJWT) {
    updateQuery.$push = { refreshJWT: data.refreshJWT }; // Push new JWT instead of replacing it
    delete updateQuery.$set.refreshJWT; // Remove from $set to avoid overwriting
  }
  return userSchema.findOneAndUpdate({ phone }, updateQuery, { new: true });
};

export const signOutUserByPhoneANDJWT = (phone: string, data: { refreshJWT?: string } & Record<string, any>) => {
  const updateQuery: Record<string, any> = { $set: { ...data } };

  if (data.refreshJWT) {
    updateQuery.$pull = { refreshJWT: data.refreshJWT }; // Remove specific JWT from the array
    delete updateQuery.$set.refreshJWT; // Ensure it is not set in $set
  }

  return userSchema.findOneAndUpdate({ phone }, updateQuery, { new: true });
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


export const getUserByPhoneAndJWT = async ({
  phone,
  refreshJWT,
}: {
  phone: string;
  refreshJWT: string;
}) => {
  return userSchema.findOne({
    phone,
    refreshJWT: { $in: [refreshJWT] }, // Check if refreshJWT exists in the array
  }).populate("cart.productId") // Populate product in cart
    .populate("cartHistory.items.productId"); // Path to populate cartHistory items;
};

