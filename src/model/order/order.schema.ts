import mongose, { Document } from 'mongoose'
import mongoose from 'mongoose';

export interface IItemTypes {
    productId: mongose.Types.ObjectId,
    quantity: number,
    price: number,
    costPrice?: number,
    supplied: number,
    note?: string,
    offerName?: string,
    comboId?: mongose.Types.ObjectId
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
    startPickingTime?: Date,
    endPickingTime?: Date,
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
                    required: true
                },
                comboId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'productComboOffer',
                },
                offerName: {
                    type: String,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                costPrice: {
                    type: Number,
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
            }
        },
        startPickingTime: {type: Date},
        endPickingTime: {type: Date},
    },
     { timestamps: true })


export default mongose.model<IOrder>("order", orderSchema)
