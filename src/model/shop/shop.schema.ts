import mongoose, { Document } from "mongoose";

export interface IShop extends Document {
    name: string;
    owner: mongoose.Types.ObjectId; // User who owns the shop
    description?: string;
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    };
    logo?: string;
    slogan: string; // Array of product IDs
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

 const ShopSchema = new mongoose.Schema<IShop>(
    {
        name: { type: String, required: true, trim: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        description: { type: String, trim: true },
        location: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String },
            country: { type: String, required: true },
            postalCode: { type: String},
        },
        logo: { type: String, default: "" },
        slogan:  { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IShop>('shop', ShopSchema);

