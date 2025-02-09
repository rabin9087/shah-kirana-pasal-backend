"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByPhoneAndJWT = exports.UpdateUserCartHistoryByPhone = exports.UpdateUserByPhone = exports.getUserByPhoneOrEmail = exports.getAllUser = exports.createUser = void 0;
const user_schema_1 = __importDefault(require("./user.schema"));
const createUser = (userObj) => {
    return new user_schema_1.default(userObj).save();
};
exports.createUser = createUser;
const getAllUser = () => {
    return user_schema_1.default.find();
};
exports.getAllUser = getAllUser;
const getUserByPhoneOrEmail = (email_phone) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_schema_1.default
        .findOne({ $or: [{ email: email_phone }, { phone: email_phone }] })
        .populate("cart.productId")
        .populate("cartHistory.items.productId");
});
exports.getUserByPhoneOrEmail = getUserByPhoneOrEmail;
const UpdateUserByPhone = (phone, data) => {
    return user_schema_1.default.findOneAndUpdate({ phone }, { $set: data }, { new: true });
};
exports.UpdateUserByPhone = UpdateUserByPhone;
const UpdateUserCartHistoryByPhone = (phone, data, amount) => {
    return user_schema_1.default.findOneAndUpdate({ phone }, {
        $push: {
            cartHistory: {
                $each: [{ items: data.items, amount, purchasedAt: new Date() }],
                $position: 0
            }
        }
    }, { new: true, upsert: true });
};
exports.UpdateUserCartHistoryByPhone = UpdateUserCartHistoryByPhone;
const getUserByPhoneAndJWT = (obj) => {
    return user_schema_1.default.findOne(obj);
};
exports.getUserByPhoneAndJWT = getUserByPhoneAndJWT;
