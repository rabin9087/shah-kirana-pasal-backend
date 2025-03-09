import mongose, { Document, Schema } from 'mongoose'
import { IProduct } from '../product/product.schema';
import mongoose from 'mongoose';

export interface IItemTypes {
    productId: mongose.Types.ObjectId,
    quantity: number,
    price: number,
    supplied: number,
    note?: string,
}

export interface IOrder extends Document {
    name: string,
    address?: string,
    phone: string,
    email: string,
    items: IItemTypes[];
    orderNumber: number,
    deliveryStatus: string,
    deliveryDate?: {
                    date: string,
                    time: string
    },
    requestDeliveryDate?: string,
    paymentType: string,
    paymentStatus: string,
    amount: number,
    createdAt: Date,
    updatedAt: Date,
    orderType: string,
    picker?: {userId: mongose.Types.ObjectId, name: string},
}

const orderSchema = new mongose.Schema<IOrder>(
    {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        items: {
            type: [{
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                supplied: {
                    type: Number,
                    default: 0,
                },
                note: {
                    type: String,
                    
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
         deliveryStatus: {
            type: String,
            required: true
        },
        deliveryDate: {
                    date: {
            type: String,
            
        },
                    time: {
            type: String,
            
        }
        },
        requestDeliveryDate: {
            type: String,
            index: true
        },
        orderType: {
            type: String,
            required: true
        },
        paymentType: {
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
        picker: {
            userId: {
                type: String,
                default: ""
            },
            name: {
                type: String,
                default: ""
            } },
    },
     { timestamps: true })


export default mongose.model<IOrder>("order", orderSchema)
