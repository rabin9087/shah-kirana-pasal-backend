
import cfStock, {ProductTypeStock } from "./cfStock.Schema";


export const createSTOCK = (StockObj: ProductTypeStock) => {
    return new cfStock(StockObj).save()
}

export const insertBulkSTOCK = (stockArr: ProductTypeStock[]) => {
    return cfStock.insertMany(stockArr);
};

export const getAllStock = () => {
    return cfStock.find()
};

export const getStockesBySKU= (sku: string) => {
    return cfStock.find({sku})
}

export const getStockesByLocation = (location: string) => {
    return cfStock.find({location})
}

export const getStockByLocationTypes = (locationType: string) => {
    return cfStock.find({locationType})
}


export const getStockByIdentifier = (identifier: string) => {
    return cfStock.findOne({identifier})
}

export const updateStockByIdentifier = (identifier: string, quantity: number, locationType: string) => {
    return cfStock.findOneAndUpdate({identifier}, {quantity, locationType})
}


export const getAOrderBySKU = (sku: string) => {
    return cfStock.findOne({sku})
}

export const getAOrderByFilter = (filter: object) => {
    return cfStock.findOne(filter).populate('items.productId')
}

export const getAOrderByOrderNumber = (filter: object) => {
    return cfStock.find(filter)
}

export const getAOrderByQRCodeNumber = ({...qrCodeNumber}) => {
    return cfStock.findOne(qrCodeNumber)
}

export const getAOrdersByDate = (requestDeliveryDate: string) => {
    return cfStock.find({requestDeliveryDate}).populate('items.productId')
}

export const getAOrderBySlug = (slug: string) => {
    return cfStock.findOne({slug})
}


export const getAOrderByStoredAT = (storedAt: string) => {
    return cfStock.findOne({storedAt})
}


export const updateAOrderByID = (_id: string, OrderObj: ProductTypeStock) => {
    return cfStock.findByIdAndUpdate(_id, OrderObj)
}

export const updateOrderStatusByID = (orderNumber: string, OrderObj: object) => {
    return cfStock.findByIdAndUpdate(orderNumber, OrderObj)
}

// export const updateAOrder = async (_id: string, data: any): Promise<ProductTypeStock | null> => {
//   const order = await cfStock.findById(_id);
//   if (!order) return null;

//   if (data.items && Array.isArray(data.items)) {
//     const updateMap = new Map<string, number>();
//     for (const { productId, supplied } of data.items) {
//       updateMap.set(productId.toString(), supplied);
//     }

//     // ✅ Safely update `supplied` without `.toObject()`
//     order.items = order.items.map((item: IItemTypes) => {
//         const key = item.productId.toString();
//       if (updateMap.has(key)) {
//         item.supplied = updateMap.get(key)!; // directly modify item
//       }
//       return item;
//     });

//     delete data.items;
//   }

//   Object.assign(order, data);
//   await order.save();
//   return order;
// };


export const deleteAOrderByID = (_id: string) => {
    return cfStock.findByIdAndDelete(_id)
}
