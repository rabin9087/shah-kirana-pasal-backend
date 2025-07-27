import { NextFunction, Request, Response } from "express";
import { createOrder, getAOrderByFilter, getAOrderByOrderNumber, getAOrdersByDate, getAllOrders, updateAOrder, updateOrderStatusByID } from "../model/order/order.model";
import { randomOTPGenerator } from "../utils/randomGenerator";
import orderSchema, { IItemTypes } from "../model/order/order.schema";
import productSchema from "../model/product/product.schema";
import axios from "axios";
  
export const addCostPriceToItems = async (items: IItemTypes[]) => {
  const updatedItems = await Promise.all(
    items.map(async (item) => {
      const product = await productSchema.findById(item.productId);
      return {
        ...item,
        costPrice: product?.costPrice ?? null,
      };
    })
  );
  return updatedItems;
};

export const createNewOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let orderNumber: string | undefined;
    let isUnique = false;

    while (!isUnique) {
      orderNumber = randomOTPGenerator();
      const existingOrder = await getAOrderByOrderNumber({ orderNumber });
      if (existingOrder.length === 0) {
        isUnique = true;
      }
    }

    req.body.items = await addCostPriceToItems(req.body.items);
    const order = await createOrder({ orderNumber, ...req.body });

    if (order?._id) {
      const productIds = order.items.map(item => item.productId);
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${order.orderNumber}&size=150x150`;

      const products = await productSchema.find({ _id: { $in: productIds } });
      const productMap: Record<string, { name: string; image: string }> = {};

      products.forEach(prod => {
        productMap[prod._id.toString()] = {
          name: prod.name,
          image: prod.images?.[0] || '',
        };
      });

      const itemsWithDetails = order.items.map(({ productId, price, quantity, note }) => {
        const prod = productMap[productId.toString()];
        return {
          productId,
          productName: prod?.name || 'Unknown',
          productImage: prod?.image || '',
          quantity,
          price,
          note,
        };
      });

      const padLeft = (str: string, length: number) =>
        str.length >= length ? str.slice(0, length - 1) + '…' : ' '.repeat(length - str.length) + str;

      const padRight = (str: string, length: number) =>
        str.length >= length ? str.slice(0, length - 1) + '…' : str + ' '.repeat(length - str.length);

      const formattedItemsText = [
        `${padRight('S.N.', 5)}${padRight('ITEM NAME', 50)}${padLeft('QTY', 5)}${padLeft('PRICE', 10)}${padLeft('TOTAL', 10)}`,
        '-'.repeat(80),
        ...itemsWithDetails.map(({ productName, quantity, price }, i) => {
          const total = price * quantity;
          return (
            `${padRight((i + 1).toString(), 5)}` +
            `${padRight(productName.toUpperCase(), 50)}` +
            `${padLeft(quantity.toString(), 5)}` +
            `${padLeft(`@$${price.toFixed(2)}`, 10)}` +
            `${padLeft(`$${total.toFixed(2)}`, 10)}`
          );
        }),
      ].join('\n');

      const grandTotal = itemsWithDetails.reduce((acc, item) => acc + item.quantity * item.price, 0);

      const htmlItems = `
<pre style="font-family: monospace; font-size: 14px; line-height: 1.4;">
🛒 Order Receipt

Customer Name : ${order.name}
Phone         : ${order.phone}
Email         : ${order.email}
Order Number  : ${order.orderNumber}

${formattedItemsText}

${padLeft("Grand Total:", 70)} $${grandTotal.toFixed(2)}
</pre>
<img src="${qrCodeUrl}" alt="QR Code" style="margin-top: 10px;" />
`;

      const ZAPIER_WEBHOOK_URL_CREATE_ORDER = process.env.ZAPIER_WEBHOOK_URL_CREATE_ORDER;

      await axios.post(ZAPIER_WEBHOOK_URL_CREATE_ORDER as string, {
        customerName: order.name,
        orderNumber: order.orderNumber,
        total: `$${order.amount.toFixed(2)}`,
        email: order.email,
        phone: order.phone,
        receiptHtml: htmlItems, // 🔥 Final receipt
        qrCodeUrl, // Optional
        items: formattedItemsText,
      });

      res.json({
        status: 'success',
        message: 'New order has been created successfully!',
        order,
      });
    } else {
      res.json({
        status: 'error',
        message: 'Error creating new order. Please try again.',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body)
    // const orderNumber = randomOTPGenerator()
    const orders = await getAllOrders();
    orders?.length
      ? res.json({
          status: "success",
          message: "All orders has been return successfully!",
          orders
        })
      : res.json({
          status: "error",
          message: "Error creating new order. \n Try again!.",
        });
  } catch (error) {
    next(error);
  }
};

export const getOrdersByDateController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date } = req.params;
    // const orderNumber = randomOTPGenerator()
    const orders = await getAOrdersByDate(date);
    orders?.length
      ?  res.json({
          status: "success",
          message: "All orders has been return successfully!",
          orders
        })
      : res.json({
          status: "Error",
        message: `Orders not available for ${date}. \n Try again!.`,
        orders
        });
  } catch (error) {
    next(error);
  }
};

export const getAOrderByFilterController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await getAOrderByFilter(req.params);
    order?._id
      ? res.json({
          status: "success",
          message: "A order has been return successfully!",
          order
        })
      : res.json({
          status: "error",
          message: "Error creating new order. \n Try again!.",
        });
  } catch (error) {
    next(error);
  }
};

export const updateAOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;
    if (req.body.items) {
       await updateProductsQuantities(req.body.items)
      req.body.items = await addCostPriceToItems(req.body.items);
    }
    
    const updatedOrder = await updateAOrder(_id as string, req.body);
    if (updatedOrder?._id) {
      const ZAPIER_WEBHOOK_URL_ORDER_STATUS = process.env.ZAPIER_WEBHOOK_URL_ORDER_STATUS

      axios.post(ZAPIER_WEBHOOK_URL_ORDER_STATUS as string, {
        status: req.body.deliveryStatus,
        name: updatedOrder.name,
        email: updatedOrder.email,
        orderNumber: updatedOrder.orderNumber,
      })
    }
    updatedOrder
      ? res.json({
          status: "success",
          message: "Orders Updated successfully!",

        })
      : res.json({
          status: "error",
          message: "Error creating new order. \n Try again!.",
      });
    
  } catch (error) {
    next(error);
  }
};

export const updateMultipleOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const incomingOrders = req.body; // Array of orders
    if (!Array.isArray(incomingOrders) || incomingOrders.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No orders provided",
      });
    }

    for (const { orderNumber, items, deliveryStatus } of incomingOrders) {
      if (!orderNumber || !Array.isArray(items)) continue;

      await updateProductsQuantities(items);
      const updatedItems = await addCostPriceToItems(items);

      // Find order by orderNumber to get its _id
      const existingOrder = await orderSchema.findOne({ orderNumber });
      if (!existingOrder) {
        console.warn(`Order with number ${orderNumber} not found`);
        continue;
      }

      // Update the order
      await updateAOrder(existingOrder?._id as string, {
        orderNumber,
        items: updatedItems,
        deliveryStatus
      });
    }

    return res.json({
      status: "success",
      message: "All orders updated successfully!",
    });

  } catch (error) {
    next(error);
  }
};

const updateProductsQuantities = async (items: any) => {
  const updatedProducts = [];
  for (const item of items) {
    const productId = item.productId

    const product = await productSchema.findById(productId.toString());
    if (!product) {
      console.warn(`Product with ID ${productId} not found`);
      continue;
    }

    const suppliedQty = parseInt(item.supplied) || 0;
    const newQuantity = product.quantity - suppliedQty;

    product.quantity = newQuantity < 0 ? 0 : newQuantity;
    await product.save();
    updatedProducts.push(product);
  }
}