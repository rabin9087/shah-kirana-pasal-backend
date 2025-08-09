// import
import jwt from "jsonwebtoken";
import { insertNewSession } from "../model/session/session.model";
import { UpdateUserByPhone } from "../model/user/user.model";
import { jwtReturnType } from "../../types";

export const createAccessJWT = async (phone: string) => {
  try {
    const token = jwt.sign({ phone }, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: "30d",
    });
    await insertNewSession({ token, associate: phone });
    return token;
  } catch (error: Error | any) {
    throw new Error(error.message);
  }
};

export const verifyAccessJWT = (token: string): jwtReturnType => {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string
  ) as jwtReturnType;
};
//// create refreshJWT and store with user data in user table: long live 30d

export const createRefreshJWT = async (phone: string): Promise<string> => {
  ///expires every 30days
  const refreshJWT = jwt.sign(
    { phone },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "30d",
    }
  );

  await UpdateUserByPhone(phone, { refreshJWT });
  return refreshJWT;
};

export const verifyRefreshJWT = (token: string): jwtReturnType => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as jwtReturnType;
};
