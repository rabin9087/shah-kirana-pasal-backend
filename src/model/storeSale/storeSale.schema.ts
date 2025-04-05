import mongoose from 'mongoose';
import mongose, { Document } from 'mongoose'

export interface IStoreSaleItemTypes {
    productId: mongose.Types.ObjectId,
    price: number,
    costPrice?: number,
    orderQuantity: number,
}


export interface IStoreSale extends Document {
    name?: string,
    address?: string,
    phone?: string,
    email?: string,
    items: IStoreSaleItemTypes[];
    orderNumber: number,
    paymentMethod: string,
    paymentStatus: string,
    amount: number,
    createdAt: Date,
    updatedAt: Date,
    customerCash?: number;
    saler: {userId: mongose.Types.ObjectId, name: string},
}

const storeSaleSchema = new mongose.Schema<IStoreSale>(
    {
        name: {
            type: String,
           index: 1,
        },
        address: {
            type: String,
        },
        phone: {
            type: String,
             index: 1,
          
        },
        email: {
            type: String,
           index: 1,
        },
        items: {
            type: [{
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'product',
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                costPrice: {
                    type: Number,
                },
                orderQuantity: {
                    type: Number,
                    default: 0,
                },
            },],
            required: true
        },
        orderNumber: {
            type: Number,
            required: true,
            unique: true,
            index: 1,
        },

        paymentMethod: {
            type: String,
            required: true
        },
        paymentStatus: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
         customerCash: {
            type: Number,
        },
        saler: {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                default: ""
            },
            name: {
                type: String,
                default: ""
            } },
    },
     { timestamps: true })


export default mongose.model<IStoreSale>("storeSale", storeSaleSchema)