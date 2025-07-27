import mongoose from "mongoose";
import { IProductTypes } from "../user/user.schema";
import { IStatus } from "../../../types";


export interface IProductComboOffer extends Document {
    _id?: string,
    offerName: string,
    status?: IStatus,
    items: IProductTypes[],
    thumbnail: string,
    totalAmount: number,
    discountAmount: number,
    offerPrice: number,
    offerStartDate?: Date,
    offerEndDate?: Date,
    description?: string,
    createdAt?: Date;
    updatedAt?: Date;
}

const productComboOfferSchema = new mongoose.Schema<IProductComboOffer>(
    {
        _id: {
            type: String,
            default: () => new mongoose.Types.ObjectId().toString(),
            indexes: true,
        },
        offerName: {
            type: String,
            required: true,
            trim: true,
            indexes: true,
        },
        status: {
            type: String,
            default: 'ACTIVE',
            indexes: true,
        },
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },
            price: {
                type: String,
                required: true
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
        offerPrice: {
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