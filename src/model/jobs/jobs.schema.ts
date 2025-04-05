// models/JobPayment.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IJobs extends Document {
    name: string,
    jobTypes: string,
    advanceAmount?: Number
    contractAmount: Number
}

const JobsSchema: Schema<IJobs> = new mongoose.Schema(
    {
    name: { type: String, required: true },
    jobTypes: { type: String, required: true },
    advanceAmount: { type: Number, default: 0},
    contractAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IJobs>("job", JobsSchema);
