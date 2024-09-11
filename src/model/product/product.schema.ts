import mongose, { Document } from 'mongoose'
import { IReviews, IStoredAt } from '../../../types';

export interface IProduct extends Document {
    _id: string,
    status: 'ACTIVE' | 'INACTIVE',
    name: string,
    alternateName?: string,
    parentCategoryID: mongose.ObjectId,
    sku: string,
    slug: string,
    productWeight?: string,
    description: string,
    images?: string,
    brand?: string,
    price: number,
    quantity: number,
    storedAt: IStoredAt,
    productLocation: string;
    aggrateRating?: number,
    thumbnail?: string,
    qrCodeNumber: string,
    salesPrice: number,
    salesStartDate?: Date,
    salesEndDate?: Date,
    productReviews?: Array<IReviews>,
    createdAt?: Date;
    updatedAt?: Date;
}


const productSchema = new mongose.Schema<IProduct>(
    {
        status: {
            type: String,
            default: "ACTIVE",
        },
        name: {
            type: String,
            required: true,
        },
        //this name should be in Nepali
        alternateName: {
            type: String,
        },
        slug: {
            type: String,
            unique: true,
            index: 1,
            required: true,
        },
        description: {
            type: String,
            required: true,
            default: ""
        },
        parentCategoryID: {
            type: mongose.Types.ObjectId,
            required: true
        },
        salesStartDate: {
            type: Date,
        },
        productWeight: {
            type: String,
        },
        salesPrice: {
            type: Number,
        },
        salesEndDate: {
            type: Date,
        },
        sku: {
            type: String,
            unique: true,
            index: 1,
            required: true,
        },
        images: [{
            type: String,
        }],
        thumbnail: {
            type: String,
            default: ""
        },
        brand: {
            type: String,
        },
        storedAt:  {
            type: String,
            required: true,
        },
        qrCodeNumber:  {
            type: String,
            unique: true,
            index: 1,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        aggrateRating: {
            type: Number,
            default: 5
        },
        productReviews: {
            type: Array,
            default: []
        },
        productLocation: {
            type: String,
            required: true
        }
    },
     { timestamps: true })


export default mongose.model<IProduct>("product", productSchema)
