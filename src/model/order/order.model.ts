
import orderSchema, { IItemTypes, IOrder } from "./order.schema";


export const createOrder = (OrderObj: IOrder) => {
    return new orderSchema(OrderObj).save()
}

export const getAllOrders = () => {
    return orderSchema.find().populate('items.productId');
};


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
    return orderSchema.findOne(filter).populate('items.productId')
}

export const getAOrderByOrderNumber = (filter: object) => {
    return orderSchema.find(filter)
}

export const getAOrderByQRCodeNumber = ({...qrCodeNumber}) => {
    return orderSchema.findOne(qrCodeNumber)
}

export const getAOrdersByDate = (requestDeliveryDate: string) => {
    return orderSchema.find({requestDeliveryDate}).populate('items.productId')
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


export const updateAOrder = async (_id: string, data: any): Promise<IOrder | null> => {
  const order = await orderSchema.findById(_id);
  if (!order) return null;

  if (data.items && Array.isArray(data.items)) {
    const updateMap = new Map<string, number>();
    for (const { productId, supplied } of data.items) {
      updateMap.set(productId.toString(), supplied);
    }

    // ✅ Safely update `supplied` without `.toObject()`
    order.items = order.items.map((item: IItemTypes) => {
        const key = item.productId.toString();
        console.log("Keys:", key)
      if (updateMap.has(key)) {
        item.supplied = updateMap.get(key)!; // directly modify item
      }
      return item;
    });

    delete data.items;
  }

  Object.assign(order, data);
  await order.save();
  return order;
};


export const deleteAOrderByID = (_id: string) => {
    return orderSchema.findByIdAndDelete(_id)
}
