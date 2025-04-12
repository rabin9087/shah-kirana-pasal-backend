// models/JobPayment.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IJobs extends Document {
    name: string,
    jobTypes: string,
    advanceAmount?: Number,
    newPayment?: [{
                subject: string, // this will be the value from input like "Site material"
                amount: Number,
                createdAt: Date,
            }],
    contractAmount: Number
}

const JobsSchema: Schema<IJobs> = new mongoose.Schema(
    {
    name: { type: String, required: true },
    jobTypes: { type: String, required: true },
    advanceAmount: { type: Number, default: 0},
    newPayment: [{
                subject: { type: String, }, // this will be the value from input like "Site material"
                amount: { type: Number},
                createdAt: { type: Date, default: Date.now},
            }],
    contractAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IJobs>("job", JobsSchema);
