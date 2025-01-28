import { createUserParams } from "../../../types";
import userSchema from "./user.schema";

export const createUser = (userObj: createUserParams) => {
  return new userSchema(userObj).save();
};

export const getAllUser = () => {
  return userSchema.find();
};
export const getUserByPhoneOrEmail = (email_phone: string) => {
  return userSchema.findOne({$or: [{ email: email_phone }, {phone: email_phone}]});
};

export const UpdateUserByPhone = (phone: string, data: Object) => {
  return userSchema.findOneAndUpdate({ phone }, { $set: data }, { new: true });
};

export const getUserByPhoneAndJWT = (obj: {
  phone: string;
  refreshJWT: string;
}) => {
  return userSchema.findOne(obj);
};
