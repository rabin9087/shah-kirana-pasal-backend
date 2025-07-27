import { createProductParams } from "../../../types";
import productSchema from "./product.schema";

export const createProduct = (productObj: createProductParams) => {
    return new productSchema(productObj).save()
}

export const getAllProducts = () => {
    return productSchema.find()
}

export const getAllActiveProducts = async() => {
     try {
        const activeProducts = await productSchema.find({ status: "ACTIVE" });
        return activeProducts;
    } catch (error) {
        console.error("Error fetching active products:", error);
        return [];
    }
}

export const getProductListByName = (name: string) => {
    return productSchema.find({name})
}

export const getAProductByID = (_id: string) => {
    return productSchema.findById(_id)
}

export const getProductListByCategory = (parentCategoryID: string) => {
    return productSchema.find({parentCategoryID})
}

export const getProductListBySlug = (slug: string) => {
    return productSchema.find({slug})
}

export const getProductListBystatus = (status: string) => {
    return productSchema.find({status})
}

export const getAProductBySKU = (sku: string) => {
    return productSchema.findOne({
        $or: [{ sku }, { qrCodeNumber: sku }],
    });
};

export const getAProductByFilter = (filter: object) => {
    return productSchema.findOne(filter)
}

export const updateAProductStatusByID = ({_id, status}: { _id: string, status: string }) => {
    return productSchema.findOneAndUpdate({_id}, {status}, {new: true})
}

export const getAProductByQRCodeNumber = ({...qrCodeNumber}) => {
    return productSchema.findOne(qrCodeNumber)
}

export const getAProductBySlug = (slug: string) => {
    return productSchema.findOne({slug})
}

export const getAProductByStoredAT = (storedAt: string) => {
    return productSchema.findOne({storedAt})
}

export const updateAProductByID = (_id: string, productObj: createProductParams) => {
    return productSchema.findByIdAndUpdate(_id, productObj)
}

export const updateAProductThumbnailByID = (_id: string, productObj: object) => {
    return productSchema.findByIdAndUpdate(_id, productObj)
}

export const updateAProduct = (_id: string, {...productObj}  ) => {
    return productSchema.updateOne({_id}, {...productObj})
}

export const deleteAProductByID = (_id: string) => {
    return productSchema.findByIdAndDelete(_id)
}
