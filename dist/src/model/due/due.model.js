"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDueAmountByID = exports.getDuesByUser = exports.createDue = void 0;
const due_schema_1 = __importDefault(require("./due.schema"));
const createDue = (dueObj) => {
    return new due_schema_1.default(dueObj).save();
};
exports.createDue = createDue;
const getDuesByUser = (userId) => {
    return due_schema_1.default.find({ userId, isActive: true })
        .populate({
        path: "salesId",
        populate: {
            path: "items.productId",
        },
    })
        .populate({
        path: "userId",
        select: "-password -refreshJWT -verificationCode -__v -cart -cartHistory",
    });
};
exports.getDuesByUser = getDuesByUser;
const updateDueAmountByID = (_id, due) => {
    const { paymentHistory } = due, rest = __rest(due, ["paymentHistory"]);
    return due_schema_1.default.findByIdAndUpdate(_id, {
        $set: Object.assign({}, rest),
        $push: { paymentHistory: { paymentMethod: paymentHistory.paymentMethod, amount: paymentHistory.amount, paymentDate: new Date() } },
    }, { new: true });
};
exports.updateDueAmountByID = updateDueAmountByID;
