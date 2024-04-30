import { createUserParams } from "../../../types";
import userSchema from "./user.schema";

export const createUser = (userObj: createUserParams) => {
  return new userSchema(userObj).save();
};
export const getUserByEmail = (email_phone: string) => {
  console.log(email_phone)
  return userSchema.findOne({$or: [{ email: email_phone }, {phone: email_phone}]});
};

export const UpdateUserByPhone = (phone: string, data: Object) => {
  return userSchema.findOneAndUpdate({ phone }, { $set: data }, { new: true });
};

export const getUserByEmailAndJWT = (obj: {
  email: string;
  refreshJWT: string;
}) => {
  return userSchema.findOne(obj);
};
