// models/JobPayment.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IJobCategory extends Document {
    user: mongoose.Schema.Types.ObjectId,
    name: string,
}

const JobCategorySchema: Schema<IJobCategory> = new mongoose.Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "user", required: true },
        name: { type: String, required: true },
    },
  { timestamps: true }
);

export default mongoose.model<IJobCategory>("jobCategory", JobCategorySchema);