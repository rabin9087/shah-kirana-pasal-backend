import { double } from 'aws-sdk/clients/lightsail';
import { Double } from 'mongodb';
import mongoose, { Decimal128 } from 'mongoose';
import mongose, { Document } from 'mongoose'

export type ProductTypeStock = {
    name: string;
    sku: string;
    location: string,
    locationType: string,
    locationCategory: string,
    identifier: string,
    price: Decimal128,
    category: string,
    expiryDate: string; // ISO date string
    quantity: number;
};

const cfStockSchema = new mongose.Schema<ProductTypeStock>(
    {
        name: {
            type: String,
            required: true
        },
        sku: {
            type: String,
            required: true,
            index: true,
        },
        location: {
            type: String,
            required: true,
            index: true,
        },
        identifier: {
            type: String,
            required: true,
            index: true,
        },
        locationType: {
            type: String,
            required: true,
            index: true,
        },
        locationCategory: {
            type: String,
            required: true,
            index: true,
        },
        category: {
            type: String,
            required: true,
             index: true,
        },
        price: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
             index: true,
        },
        expiryDate: {
            type: String,
            required: true,
             index: true,
        },
        quantity: {
            type: Number,
            required: true,
             index: true,
        },

    },
     { timestamps: true })


export default mongose.model<ProductTypeStock>("cfStock", cfStockSchema)
