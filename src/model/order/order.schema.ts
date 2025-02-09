import mongose, { Document, Schema } from 'mongoose'
import { IProduct } from '../product/product.schema';
import mongoose from 'mongoose';

export interface IItemTypes {
    productId: mongose.Types.ObjectId,
    quantity: number,
    price: number,
    note?: string,
}

export interface IOrder extends Document {
    name: string,
    address: string,
    phone: string,
    email: string,
    items: IItemTypes[];
    orderNumber: number,
    deliverStatus: string,
    deliveryDate?: {
                    date: string,
                    time: string
    },
    requestDeliveryDate?: string,
    payment: string,
    amount: number,
}


const orderSchema = new mongose.Schema<IOrder>(
    {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
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
                    ref: 'Product',
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
         deliverStatus: {
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
            
        },
        payment: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    },
     { timestamps: true })


export default mongose.model<IOrder>("order", orderSchema)
