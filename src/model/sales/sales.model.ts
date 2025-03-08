import orderSchema from "../order/order.schema"

export const getTotalSales = () => {
    return orderSchema.find({}, 'amount paymentStatus').exec()
}

export const getAllSales = () => {
    return orderSchema.find({}, 'amount requestDeliveryDate items paymentStatus', ).exec()
}