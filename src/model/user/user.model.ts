import { createUserParams } from "../../../types";
import userSchema from "./user.schema";

export const createUser = (userObj: createUserParams) => {
  return new userSchema(userObj).save();
};
export const getUserByEmail = (email: string) => {
  return userSchema.findOne({ email } || {phone: email});
};

export const UpdateUserByEmail = (email: string, data: Object) => {
  return userSchema.findOneAndUpdate({ email }, { $set: data }, { new: true });
};

export const getUserByEmailAndJWT = (obj: {
  email: string;
  refreshJWT: string;
}) => {
  return userSchema.findOne(obj);
};
