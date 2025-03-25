import storeSaleSchema, { IStoreSale } from "./storeSale.schema"

export const createStoreSaleOrder = (storeSaleObj: IStoreSale) => {
    return new storeSaleSchema(storeSaleObj).save()
}

export const getAStoreSaleOrderByOrderNumber = (filter: object) => {
    return storeSaleSchema.find(filter)
}

export const getAllStoreSale = () => {
    return storeSaleSchema.find()
}

export const getDailyStoreSale = () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);  // start of today

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);  // end of today

    return storeSaleSchema.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
};