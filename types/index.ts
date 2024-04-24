import { IUser } from "../src/model/user/user.schema";

export interface CustomError extends Error {
  statusCode: number;
}
export type jwtReturnType =
  | { email: string; iat: number; exp: number }
  | undefined;

declare global {
  namespace Express {
    interface Request {
      userInfo?: IUser;
    }
  }
}
export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type createUserParams = {
  fName: string;
  lName: string;
  email: string;
  password: string;
  address?: string;
};
