import shopSchema, { IShop } from "./shop.schema";

export const createShop = (shopObj: IShop) => {
  return new shopSchema(shopObj).save();
};

export const getAllShop = () => {
  return shopSchema.find()
};
