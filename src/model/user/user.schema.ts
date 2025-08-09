import mongoose, { Document, Schema } from "mongoose";
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
  searchHistory?: string[]; // Store search history
  searchedItemsQrCode?: string[]; // Store searched items
  createdAt?: Date;
  updatedAt?: Date;

}

export interface IProductTypes {
  productId: mongoose.Schema.Types.ObjectId;
  price: string;
  qty: string;
}

export interface IAddToCartTypes extends IProductTypes {
  orderQuantity: number;
  note?: string;
}

export interface ICartHistory {
  items: IAddToCartTypes[]; // Store previous cart data
  purchasedAt?: Date; // Store timestamp of purchase
}

// Optimized subdocument schemas
const CartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "product", // Capitalized for consistency
    required: true,
    index: true, // Index for faster lookups
  },
  price: {
    type: Number, // Changed from String to Number
    required: true,
    min: 0,
  },
  orderQuantity: {
    type: Number,
    required: true,
    min: 1,
  },
  note: {
    type: String,
    maxlength: 500,
  },
}, { _id: false }); // Disable _id for subdocuments to save space


const CartHistorySchema = new Schema({
  items: {
    type: [CartItemSchema],
    validate: {
      validator: function(items: IAddToCartTypes[]) {
        return items.length > 0;
      },
      message: 'Cart history must contain at least one item'
    }
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
    index: true, // Index for date-based queries
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'NotPaid'],
    default: 'PENDING',
    index: true,
  },
   orderType: {
    type: String,
    // enum: ['pickup' , 'delivery'],
    index: true,
  },
  deliveryStatus: {
    type: String,
    enum: ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING',
    index: true,
  }
}, { _id: true });


// Optimized main user schema
const userSchema = new Schema<IUser>(
  {
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
      default: "ACTIVE",
      index: true, // Index for filtering active users
    },
    role: {
      type: String,
      enum: Role,
      required: true,
      default: "USER",
      index: true, // Index for role-based queries
    },
    fName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          return /^[+]?[\d\s\-\(\)]+$/.test(v);
        },
        message: 'Invalid phone number format'
      }
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allow null values while maintaining uniqueness
      trim: true,
      // lowercase: true,
      validate: {
        validator: function(v: string) {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format'
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      // select: false, // Never include password in queries by default
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true, // Index for filtering verified users
    },
    verificationCode: {
      type: String,
      default: null,
      select: false, // Hide by default
      expires: 600, // Auto-delete after 10 minutes (if using TTL)
    },
    refreshJWT: {
      type: [String],
      default: [],
      select: false, // Hide sensitive JWT tokens
      validate: {
        validator: function(tokens: string[]) {
          return tokens.length <= 5; // Limit concurrent sessions
        },
        message: 'Too many active sessions'
      }
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters'],
    },
    profile: {
      type: String,
      default: null,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+/.test(v) || /^data:image\//.test(v);
        },
        message: 'Invalid profile image URL'
      }
    },
    cart: {
      type: [CartItemSchema],
      default: [],
      validate: {
        validator: function(cart: IAddToCartTypes[]) {
          return cart.length <= 100; // Prevent cart abuse
        },
        message: 'Cart cannot exceed 100 items'
      }
    },
    cartHistory: {
      type: [CartHistorySchema],
      default: [],
      select: true, // Heavy field, exclude by default
    },
    searchHistory: {
      type: [String],
      default: [],
      select: false, // Heavy field, exclude by default
      validate: {
        validator: function(history: string[]) {
          return history.length <= 1000; // Limit search history
        },
        message: 'Search history limit exceeded'
      }
    },
    searchedItemsQrCode: {
      type: [String],
      default: [],
      select: false, // Heavy field, exclude by default
    },
  },
  {
    timestamps: true,
    versionKey: false, // Remove __v field
    // Optimize for JSON responses
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.verificationCode;
        delete ret.refreshJWT;
        return ret;
      }
    }
  }
);

// Compound indexes for optimal query performance
userSchema.index({ phone: 1, status: 1 }); // Login queries
userSchema.index({ email: 1, status: 1 }); // Email login queries  
userSchema.index({ status: 1, role: 1 }); // Admin queries
userSchema.index({ status: 1, isVerified: 1 }); // Verification queries
userSchema.index({ status: 1, createdAt: -1 }); // Recent users

// Virtual for full name
userSchema.virtual('fullName').get(function(this: IUser) {
  return `${this.fName} ${this.lName}`.trim();
});

// Virtual for cart total
userSchema.virtual('cartTotal').get(function(this: IUser) {
  return this.cart.reduce((total, item) => total + (parseInt(item?.price) * item.orderQuantity), 0);
});

// Virtual for cart item count
userSchema.virtual('cartItemCount').get(function(this: IUser) {
  return this.cart.reduce((count, item) => count + item.orderQuantity, 0);
});

// Static methods for common queries
userSchema.statics.findActive = function() {
  return this.find({ status: 'ACTIVE' });
};

userSchema.statics.findByPhoneOrEmail = function(identifier: string) {
  return this.findOne({
    $or: [{ phone: identifier }, { email: identifier }],
    status: 'ACTIVE'
  }).select('+password'); // Include password for login
};

// Middleware to clean up old refresh tokens
userSchema.pre('save', function(this: IUser, next) {
  if (this.isModified('refreshJWT') && this.refreshJWT && this.refreshJWT.length > 5) {
    // Keep only the 5 most recent tokens
    this.refreshJWT = this.refreshJWT.slice(-5);
  }
  next();
});


export default mongoose.model("user", userSchema);
