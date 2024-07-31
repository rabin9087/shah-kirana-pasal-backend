"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const types_1 = require("../../../types");
const userSchema = new mongoose_1.default.Schema({
    status: {
        type: String,
        default: "inactive",
    },
    role: {
        type: String,
        enum: types_1.Role,
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
        unique: true
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
        type: String,
        default: "",
    },
    address: {
        type: String,
        default: "",
    },
    profile: {
        type: String,
        default: "https://cfw-image-bucket.s3.ap-southeast-2.amazonaws.com/default.jpg",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("user", userSchema);
