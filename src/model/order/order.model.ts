
import orderSchema, { IOrder } from "./order.schema";


export const createOrder = (OrderObj: IOrder) => {
    return new orderSchema(OrderObj).save()
}


export const getAllOrders = () => {
    return orderSchema.find()
}


export const getOrderListByName = (name: string) => {
    return orderSchema.find({name})
}


export const getAOrderByID = (_id: string) => {
    return orderSchema.findById(_id)
}


export const getOrderListByCategory = (parentCategoryID: string) => {
    return orderSchema.find({parentCategoryID})
}


export const getOrderListBySlug = (slug: string) => {
    return orderSchema.find({slug})
}


export const getOrderListBystatus = (status: string) => {
    return orderSchema.find({status})
}


export const getAOrderBySKU = (sku: string) => {
    return orderSchema.findOne({sku})
}

export const getAOrderByFilter = (filter: object) => {
    return orderSchema.findOne(filter)
}

export const getAOrderByQRCodeNumber = ({...qrCodeNumber}) => {
    return orderSchema.findOne(qrCodeNumber)
}


export const getAOrderBySlug = (slug: string) => {
    return orderSchema.findOne({slug})
}


export const getAOrderByStoredAT = (storedAt: string) => {
    return orderSchema.findOne({storedAt})
}


export const updateAOrderByID = (_id: string, OrderObj: IOrder) => {
    return orderSchema.findByIdAndUpdate(_id, OrderObj)
}


export const updateAOrder = (_id: string, {...OrderObj}  ) => {
    return orderSchema.updateOne({_id}, {...OrderObj})
}


export const deleteAOrderByID = (_id: string) => {
    return orderSchema.findByIdAndDelete(_id)
}
