"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneAndDelete = exports.CheckUserByToken = exports.findOneByFilterAndDelete = exports.insertNewSession = void 0;
const session_schema_1 = __importDefault(require("./session.schema"));
const insertNewSession = (obj) => {
    return new session_schema_1.default(obj).save();
};
exports.insertNewSession = insertNewSession;
const findOneByFilterAndDelete = (filter) => {
    return session_schema_1.default.findOneAndDelete(filter);
};
exports.findOneByFilterAndDelete = findOneByFilterAndDelete;
const CheckUserByToken = (filter) => {
    return session_schema_1.default.findOne(filter);
};
exports.CheckUserByToken = CheckUserByToken;
const findOneAndDelete = (token) => {
    return session_schema_1.default.findOneAndDelete(token);
};
exports.findOneAndDelete = findOneAndDelete;
