import { z } from "zod";
import { IUser } from "../src/model/user/user.schema";
import { envVariables } from "../src/utils/env";
import mongoose from "mongoose";


export interface CustomError extends Error {
  statusCode: number;
}
export type jwtReturnType =
  | { phone: string; iat: number; exp: number }
  | undefined;


declare global {
  namespace Express {
    interface Request {
      userInfo?: IUser | IUser[];
    }
  }
}

interface ImportMetaEnv {
  readonly JWT_ACCESS_SECRET: string;
  readonly JWT_REFRESH_SECRET: string;
  readonly WEB_DOMAIN: string;
  readonly GMAIL_APP_NAME: string;
  readonly GMAIL_APP_PASSWORD: string;
  readonly GMAIL_USER: string;
  readonly BUCKET_NAME: string;
  readonly REGION: string;
  readonly ACCESS_KEY: string;
  readonly SECRET_KEY: string;
  readonly STRIP_SECRET: string;
  readonly MONGO_URI: string;
  // Add other environment variables here...
}



declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {
      readonly env: ImportMetaEnv;
    }
  }
}


export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}


export enum IStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export type createUserParams = {
  fName: string;
  lName: string;
  email?: string;
  phone: string;
  password: string;
  address?: string;
};

export type createCategoryParams = {
    status?: string,
    name: string,
    description?: string,
};

export interface IReviews{
  userId: string,
  review: string
}

export enum IStoredAt {
  AMBIENT = "AMBIENT",
  CHILLED = "CHILLED",
  "FRUTES AND VEG" = "FRUTES AND VEG"
}


export type createProductParams = {
  _id?: string,
  name: string,
  alternateName: string,
  parentCategoryID: mongoose.Types.ObjectId,
  sku: string,
  salesPrice?: number,
  slug: string,
  description: string,
  images?: Array<string>,
  brand?: string,
  price: number,
  quantity: number,
  productWeight?: string,
  storedAt: IStoredAt,
  aggrateRating?: number,
  thumbnail?: string,
  qrCodeNumber: string,
  salesStartDate?: Date,
  salesEndDate?: Date,
  productReviews?: Array<IReviews>,
  productLocation: string;
};


