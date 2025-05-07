import mongoose, { Document } from "mongoose";

export interface IDue extends Document {
    userId: mongoose.Types.ObjectId;
    salesId: mongoose.Types.ObjectId; // User who owns the shop
    totalAmout: number;
    dueAmount: number;
    paymentHistory?: [{paymentMethod: string; amount: number, paymentDate: Date,  _id?: mongoose.Types.ObjectId; }]
    duePaymentStatus: string; // Array of product IDs
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

 const DueSchema = new mongoose.Schema<IDue>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, indexes: 1,  ref: 'user', required: true },
        salesId: { type: mongoose.Schema.Types.ObjectId, indexes: 1, ref: 'storeSale', required: true },
        totalAmout: { type: Number, required: true},
        dueAmount: { type: Number, required: true },
        paymentHistory: [{paymentMethod:  {type: String}, amount: {type: Number}, paymentDate: {type: Date}}],
        duePaymentStatus: { type: String, default:  ""},
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IDue>('due', DueSchema);

