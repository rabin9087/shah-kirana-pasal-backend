import mongose, { Document } from 'mongoose'
import { IReviews, IStoredAt } from '../../../types';
import { getAllShop } from '../shop/shop.model';
import mongoose from 'mongoose';

export interface IProduct extends Document {
    _id: string,
    status: 'ACTIVE' | 'INACTIVE',
    name: string,
    alternateName?: string,
    parentCategoryID: mongose.ObjectId,
    sku: string,
    slug: string,
    productWeight?: string,
    description?: string,
    images?: string,
    brand?: string,
    price: number,
    retailerPrice?: number,
    costPrice?: number,
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
    expireDate?: string,
    createdAt?: Date;
    updatedAt?: Date;
}

const productSchema = new mongose.Schema<IProduct>(
    {
        status: {
            type: String,
            default: "ACTIVE",
            enum: ['ACTIVE', 'INACTIVE'],
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,    

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
            index: 1,
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
         retailerPrice: {
            type: Number,
        },
          costPrice: {
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
            index: 1
        }],
        thumbnail: {
            type: String,
            default: "",
            index: 1,
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
          expireDate: {
            type: String,
            default: ""
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
        },
      
    },
     { timestamps: true })

     // ✅ Function to get model for a specific shop
// export const getProductModelForShop = (shopName: string) => {
//   const collectionName = `products_${shopName}`;
//   // Avoid recompilation in dev
//   return mongoose.models[collectionName] ||
//     mongoose.model<IProduct>(collectionName, productSchema, collectionName);
// };

// export const allShopsProducts = async () => { 
//       const shops = await getAllShop();
//       const allProducts = await Promise.all(
//         shops.map(async (shop) => {
//         const model = getProductModelForShop(shop.name.toString());
//         return model.find();
//      })
//       );
//       return allProducts.flat();
// }

export default mongose.model<IProduct>("product", productSchema)

// allShopsProducts()