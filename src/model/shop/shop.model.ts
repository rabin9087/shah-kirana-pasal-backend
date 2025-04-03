import shopSchema, { IShop } from "./shop.schema";

export const createShop = (shopObj: IShop) => {
  return new shopSchema(shopObj).save();
};
