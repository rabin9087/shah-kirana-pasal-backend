"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmailAndJWT = exports.UpdateUserByEmail = exports.getUserByEmail = exports.createUser = void 0;
const user_schema_1 = __importDefault(require("./user.schema"));
const createUser = (userObj) => {
    return new user_schema_1.default(userObj).save();
};
exports.createUser = createUser;
const getUserByEmail = (email) => {
    return user_schema_1.default.findOne({ email });
};
exports.getUserByEmail = getUserByEmail;
const UpdateUserByEmail = (email, data) => {
    return user_schema_1.default.findOneAndUpdate({ email }, { $set: data }, { new: true });
};
exports.UpdateUserByEmail = UpdateUserByEmail;
const getUserByEmailAndJWT = (obj) => {
    return user_schema_1.default.findOne(obj);
};
exports.getUserByEmailAndJWT = getUserByEmailAndJWT;
