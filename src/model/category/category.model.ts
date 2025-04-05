import { createCategoryParams } from "../../../types";
import categorySchema from "./category.schema";

export const createCategory = (categoryObj: createCategoryParams) => {
    return new categorySchema(categoryObj).save()
}

export const getAllCategories = () => {
    return categorySchema.find()
}

export const getACategoryByID = (_id: string) => {
    return categorySchema.findById(_id)
}

export const getACategoryBySlug = (slug: string) => {
    return categorySchema.findOne({slug})
}

export const updateCategoryByID = (_id: string, categoryObj: createCategoryParams ) => {
    return categorySchema.findByIdAndUpdate(_id, categoryObj)
}

export const deleteACategoryByID = (_id: string) => {
    return categorySchema.findByIdAndDelete(_id)
}

