import mongoose, { Document } from "mongoose";
import { Role } from "../../../types";
import product from "../product/product.schema"; 
import { string } from "zod";

export interface IUser extends Document {
  _id: string;
  role: 'ADMIN'| 'USER' | 'MODERATOR' | 'SUPERADMIN' | 'PICKER' | "STOREUSER";
  status: string;
  fName: string;
  lName: string;
  phone: string;
  email?: string;
  password: string | undefined;
  isVerified: boolean;
  verificationCode: string | null | undefined;
  refreshJWT: string[] | [] | null | undefined ;
  address?: string;
  profile: string | null;
  cart: IAddToCartTypes[]; // Current active cart
  cartHistory: ICartHistory[]; 
  createdAt?: Date;
  updatedAt?: Date;

}

export interface IProductTypes {
  productId: mongoose.ObjectId;
  price: string;
}

export interface IAddToCartTypes extends IProductTypes {
  orderQuantity: number;
  note?: string;
}

export interface ICartHistory {
  items: IAddToCartTypes[]; // Store previous cart data
  purchasedAt?: Date; // Store timestamp of purchase
}

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product", // Reference the Product model
  },
  price: String,
  orderQuantity: Number,
  note: String,
});

const CartHistorySchema = new mongoose.Schema({
  items: [CartItemSchema],
  amount: Number,
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
  orderNumber: String,
  paymentStatus: String,
  deliveryStatus: String
});


const userSchema = new mongoose.Schema<IUser>(
  {
    status: {
      type: String,
      default: "ACTIVE",
    },
    role: {
      type: String,
      enum: Role,
      required: true,
      default: "USER",
    },
    fName: {
      type: String,
      required: true,
    },

    lName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique:true
    },

    email: {
      type: String,
      unique: true,
      index: 1,
    },

    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: "",
    },
    refreshJWT: {
    type: [String], // Change from `String` to an array `[String]`
    default: [],
    },
    address: {
      type: String,
      default: "",
    },
    profile: {
      type: String,
      default:"",
    },
    cart: {
      type: [CartItemSchema],
      default: [],
    },
    cartHistory: {
      type: [CartHistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);
export default mongoose.model("user", userSchema);
