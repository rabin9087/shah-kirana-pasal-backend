// models/JobPayment.ts
import mongoose, { Schema, Document } from "mongoose";



export interface IJobCategory extends Document {
    name: string,
}

const JobCategorySchema: Schema<IJobCategory> = new mongoose.Schema(
    {
        name: { type: String, required: true },
    },
  { timestamps: true }
);

export default mongoose.model<IJobCategory>("jobCategory", JobCategorySchema);