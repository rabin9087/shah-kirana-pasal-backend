"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../../../types");
const CartItemSchema = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "product",
        required: true,
        index: true,
    },
    price: {
        type: Number,
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
}, { _id: false });
const CartHistorySchema = new mongoose_1.Schema({
    items: {
        type: [CartItemSchema],
        validate: {
            validator: function (items) {
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
        index: true,
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
        index: true,
    },
    deliveryStatus: {
        type: String,
        enum: ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING',
        index: true,
    }
}, { _id: true });
const userSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
        default: "ACTIVE",
        index: true,
    },
    role: {
        type: String,
        enum: types_1.Role,
        required: true,
        default: "USER",
        index: true,
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
            validator: function (v) {
                return /^[+]?[\d\s\-\(\)]+$/.test(v);
            },
            message: 'Invalid phone number format'
        }
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        validate: {
            validator: function (v) {
                return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Invalid email format'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    isVerified: {
        type: Boolean,
        default: false,
        index: true,
    },
    verificationCode: {
        type: String,
        default: null,
        select: false,
        expires: 600,
    },
    refreshJWT: {
        type: [String],
        default: [],
        select: false,
        validate: {
            validator: function (tokens) {
                return tokens.length <= 5;
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
            validator: function (v) {
                return !v || /^https?:\/\/.+/.test(v) || /^data:image\//.test(v);
            },
            message: 'Invalid profile image URL'
        }
    },
    cart: {
        type: [CartItemSchema],
        default: [],
        validate: {
            validator: function (cart) {
                return cart.length <= 100;
            },
            message: 'Cart cannot exceed 100 items'
        }
    },
    cartHistory: {
        type: [CartHistorySchema],
        default: [],
        select: true,
    },
    searchHistory: {
        type: [String],
        default: [],
        select: false,
        validate: {
            validator: function (history) {
                return history.length <= 1000;
            },
            message: 'Search history limit exceeded'
        }
    },
    searchedItemsQrCode: {
        type: [String],
        default: [],
        select: false,
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
            delete ret.verificationCode;
            delete ret.refreshJWT;
            return ret;
        }
    }
});
userSchema.index({ phone: 1, status: 1 });
userSchema.index({ email: 1, status: 1 });
userSchema.index({ status: 1, role: 1 });
userSchema.index({ status: 1, isVerified: 1 });
userSchema.index({ status: 1, createdAt: -1 });
userSchema.virtual('fullName').get(function () {
    return `${this.fName} ${this.lName}`.trim();
});
userSchema.virtual('cartTotal').get(function () {
    return this.cart.reduce((total, item) => total + (parseInt(item === null || item === void 0 ? void 0 : item.price) * item.orderQuantity), 0);
});
userSchema.virtual('cartItemCount').get(function () {
    return this.cart.reduce((count, item) => count + item.orderQuantity, 0);
});
userSchema.statics.findActive = function () {
    return this.find({ status: 'ACTIVE' });
};
userSchema.statics.findByPhoneOrEmail = function (identifier) {
    return this.findOne({
        $or: [{ phone: identifier }, { email: identifier }],
        status: 'ACTIVE'
    }).select('+password');
};
userSchema.pre('save', function (next) {
    if (this.isModified('refreshJWT') && this.refreshJWT && this.refreshJWT.length > 5) {
        this.refreshJWT = this.refreshJWT.slice(-5);
    }
    next();
});
exports.default = mongoose_1.default.model("user", userSchema);
