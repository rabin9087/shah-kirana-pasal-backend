// import
import jwt from "jsonwebtoken";
import { insertNewSession } from "../model/session/session.model";
import { UpdateUserByEmail } from "../model/user/user.model";
import { jwtReturnType } from "../../types";

export const createAccessJWT = async (email: string) => {
  try {
    const token = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: "1d",
    });
    await insertNewSession({ token, associate: email });
    return token;
  } catch (error: Error | any) {
    throw new Error(error.message);
  }
};

export const verifyAccessJWT = (token: string): jwtReturnType => {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string
  ) as jwtReturnType
};
//// create refreshJWT and store with user data in user table: long live 30d

export const createRefreshJWT = async (email: string): Promise<string> => {
  ///expires every 30days
  const refreshJWT = jwt.sign(
    { email },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "15d",
    }
  );

  await UpdateUserByEmail(email, { refreshJWT });
  return refreshJWT;
};

export const verifyRefreshJWT = (token: string): jwtReturnType => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as jwtReturnType;
};
