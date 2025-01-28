"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByPhoneAndJWT = exports.UpdateUserByPhone = exports.getUserByPhoneOrEmail = exports.getAllUser = exports.createUser = void 0;
const user_schema_1 = __importDefault(require("./user.schema"));
const createUser = (userObj) => {
    return new user_schema_1.default(userObj).save();
};
exports.createUser = createUser;
const getAllUser = () => {
    return user_schema_1.default.find();
};
exports.getAllUser = getAllUser;
const getUserByPhoneOrEmail = (email_phone) => {
    return user_schema_1.default.findOne({ $or: [{ email: email_phone }, { phone: email_phone }] });
};
exports.getUserByPhoneOrEmail = getUserByPhoneOrEmail;
const UpdateUserByPhone = (phone, data) => {
    return user_schema_1.default.findOneAndUpdate({ phone }, { $set: data }, { new: true });
};
exports.UpdateUserByPhone = UpdateUserByPhone;
const getUserByPhoneAndJWT = (obj) => {
    return user_schema_1.default.findOne(obj);
};
exports.getUserByPhoneAndJWT = getUserByPhoneAndJWT;
