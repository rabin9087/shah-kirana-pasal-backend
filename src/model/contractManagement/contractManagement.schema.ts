// models/JobPayment.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IJobPayment extends Document {
  jobId: mongoose.Types.ObjectId;
  contractRate: number;
  advance: number;
  paymentMethod: "Cash" | "Card" | "Bank Transfer" | "Other";
  paymentDate: Date;
  remainingAmount: number;
}

const JobPaymentSchema: Schema<IJobPayment> = new mongoose.Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    contractRate: { type: Number, required: true },
    advance: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Bank Transfer", "Other"],
      required: true,
    },
    paymentDate: { type: Date, required: true },
    remainingAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IJobPayment>("JobPayment", JobPaymentSchema);
