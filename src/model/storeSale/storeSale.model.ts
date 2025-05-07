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

export const getDailyStoreSale = (date: string) => {
    const selectedDate = new Date(date);

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    return storeSaleSchema.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
};