import mongose, { Document } from 'mongoose'
import { IStatus } from '../../../types';


export interface ICategory extends Document {
    _id: string,
    status: IStatus,
    name: string,
    alternativeName?: string,
    description?: string,
    slug: string,
    createdAt?: Date;
    updatedAt?: Date;
}


const categorySchema = new mongose.Schema<ICategory>(
    {
        status: {
            type: String,
            default: IStatus.ACTIVE,
        },
        name: {
            type: String,
            required: true,
        },
         alternativeName: {
            type: String,
        },
        description: {
            type: String,
            default: ""
        },
        slug: {
            type: String,
            unique: true,
            index: 1,
            required: true,
        },
    }, { timestamps: true })


export default mongose.model("category", categorySchema)

