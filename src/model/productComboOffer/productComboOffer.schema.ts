import mongoose, { Schema } from "mongoose";
import { IStatus } from "../../../types";

// Define item type inline for clarity
export interface IComboItem {
  productId: mongoose.Schema.Types.ObjectId;
  price: string;
  qty: string;
}

export interface IProductComboOffer extends Document {
    // _id: mongoose.Schema.Types.ObjectId | string,
    offerName: string,
    status?: IStatus,
    items: IComboItem[],
    thumbnail: string,
    totalAmount: number,
    discountAmount: number,
    price: number,
    offerStartDate?: Date,
    offerEndDate?: Date,
    description?: string,
    createdAt?: Date;
    updatedAt?: Date;
}

const productComboOfferSchema = new mongoose.Schema<IProductComboOffer>(
    {
        // _id: {
        //     type: mongoose.Schema.Types.ObjectId || String,
        //     index: true,
        // },
        offerName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        status: {
            type: String,
            default: 'ACTIVE',
            index: true,
        },
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId || String,
                ref: 'product',
                required: true,
                // select: true,
            },
            price: {
                type: String,
                required: true
            },
            qty: {
                type: String,
                required: true,
                min: 1
            }
        }],
        thumbnail: {
            type: String,
            required: true,
            trim: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        discountAmount: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        offerStartDate: {
            type: Date,
            required: true,
        },
        offerEndDate: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        }
    },
    { timestamps: true }
)

export default mongoose.model<IProductComboOffer>('productComboOffer', productComboOfferSchema);