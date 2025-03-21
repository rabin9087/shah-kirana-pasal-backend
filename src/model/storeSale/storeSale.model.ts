import storeSaleSchema, { IStoreSale } from "./storeSale.schema"

export const createStoreSaleOrder = (storeSaleObj: IStoreSale) => {
    return new storeSaleSchema(storeSaleObj).save()
}

export const getAStoreSaleOrderByOrderNumber = (filter: object) => {
    return storeSaleSchema.find(filter)
}