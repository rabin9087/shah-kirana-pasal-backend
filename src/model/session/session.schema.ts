import mongoose, { Document } from "mongoose";

export interface ISession extends Document {
  _id: string;
  token: string;
  associate: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
}
const sessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    associate: {
      type: String,
      required: true,
      default: "",
      index: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("session", sessionSchema); ///sessions
