import mongoose, { Document } from "mongoose";

export interface ISearch extends Document {
  searchQuery: string;
}
const searchSchema = new mongoose.Schema(
  {
    searchQuery: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("search", searchSchema); ///sessions