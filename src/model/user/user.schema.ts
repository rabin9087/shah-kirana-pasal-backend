import mongoose, { Document } from "mongoose";
import { Role } from "../../../types";

export interface IUser extends Document {
  _id: string;
  role: 'ADMIN'|'USER';
  status: string;
  fName: string;
  lName: string;
  phone: string;
  email: string;
  password: string | undefined;
  isVerified: boolean;
  verificationCode: string | null;
  refreshJWT: string | undefined;
  address?: string;
  profile: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
const userSchema = new mongoose.Schema<IUser>(
  {
    status: {
      type: String,
      default: "inactive",
    },
    role: {
      type: String,
      enum: Role,
      required: true,
      default: "USER",
    },
    fName: {
      type: String,
      required: true,
    },

    lName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      uniqure:true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: 1,
    },

    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: "",
    },
    refreshJWT: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },
    profile: {
      type: String,
      default:
        "https://cfw-image-bucket.s3.ap-southeast-2.amazonaws.com/default.jpg",
    },
  },
  { timestamps: true }
);
export default mongoose.model("user", userSchema);
