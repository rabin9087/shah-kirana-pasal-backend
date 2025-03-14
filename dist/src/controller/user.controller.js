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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLinkController = exports.getAUserByPhoneController = exports.getAllUsersController = exports.getUserController = exports.updatePassword = exports.OTPVerification = exports.OTPRequest = exports.signOutUser = exports.loginUser = exports.updateUserCartHistoryController = exports.updateUserCartController = exports.updateAUserProfile = exports.updateUserProfile = exports.createNewUser = void 0;
const user_model_1 = require("../model/user/user.model");
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const nodemailer_1 = require("../utils/nodemailer");
const randomGenerator_1 = require("../utils/randomGenerator");
const createNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        req.body.password = (0, bcrypt_1.hashPassword)(password);
        const newUser = yield (0, user_model_1.createUser)(req.body);
        newUser.password = undefined;
        (newUser === null || newUser === void 0 ? void 0 : newUser._id)
            ? res.json({
                status: "success",
                message: "Please check your email to verify your account",
                data: newUser,
            })
            : res.json({
                status: "error",
                message: "Error creating the account.",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.createNewUser = createNewUser;
const updateUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.files) {
            const files = req.files;
            if (files["profile"]) {
                req.body.profile = files["profile"][0].location;
            }
        }
        else {
            return res.status(400).json({ status: "error", message: "No file uploaded." });
        }
        if (!req.body.phone) {
            return res.status(400).json({ status: "error", message: "Phone number is required." });
        }
        const updatedUser = yield (0, user_model_1.UpdateUserByPhone)(req.body.phone, { profile: req.body.profile });
        if (updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._id) {
            res.json({
                status: "success",
                message: "Profile updated successfully!",
                data: updatedUser,
            });
        }
        else {
            res.status(400).json({
                status: "error",
                message: "Failed to update profile.",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserProfile = updateUserProfile;
const updateAUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone } = req.params;
        const updatedUser = yield (0, user_model_1.UpdateUserByPhone)(phone, req.body);
        if (updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._id) {
            updatedUser.password = undefined;
            res.json({
                status: "success",
                message: "Profile updated successfully!",
                data: updatedUser,
            });
        }
        else {
            res.status(400).json({
                status: "error",
                message: "Failed to update profile.",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateAUserProfile = updateAUserProfile;
const updateUserCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUserCart = yield (0, user_model_1.UpdateUserByPhone)(req.body.phone, { cart: req.body.cart });
        if (updatedUserCart === null || updatedUserCart === void 0 ? void 0 : updatedUserCart._id) {
            res.json({
                status: "success",
                message: "Cart updated successfully!",
                data: updatedUserCart,
            });
        }
        else {
            res.status(400).json({
                status: "error",
                message: "Failed to update profile.",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserCartController = updateUserCartController;
const updateUserCartHistoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, cartHistory, amount, orderNumber } = req.body;
        const updatedUserCartHistory = yield (0, user_model_1.UpdateUserCartHistoryByPhone)(phone, cartHistory, amount, orderNumber);
        if (updatedUserCartHistory === null || updatedUserCartHistory === void 0 ? void 0 : updatedUserCartHistory._id) {
            res.json({
                status: "success",
                message: "Cart updated successfully!",
                data: updatedUserCartHistory,
            });
        }
        else {
            res.status(400).json({
                status: "error",
                message: "Failed to update profile.",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserCartHistoryController = updateUserCartHistoryController;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email_phone, password } = req.body;
        if (!email_phone || !password)
            throw new Error("Missing credentials.");
        const user = yield (0, user_model_1.getUserByPhoneOrEmail)(email_phone);
        if (!user) {
            return res
                .status(401)
                .json({ status: "error", message: `No user found with ${email_phone}` });
        }
        const isValidPassword = (0, bcrypt_1.validatePassword)(password, user.password);
        if (!isValidPassword)
            return res
                .status(401)
                .send({ status: "error", message: "Wrong password." });
        return res.json({
            status: "success",
            message: `Welcome back ${user.fName} !`,
            tokens: {
                accessJWT: yield (0, jwt_1.createAccessJWT)(user.phone),
                refreshJWT: yield (0, jwt_1.createRefreshJWT)(user.phone),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
const signOutUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                status: "error",
                message: "No Authorization provided",
            });
        }
        const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : authorization;
        const decoded = (0, jwt_1.verifyRefreshJWT)(token);
        if (!decoded || !decoded.phone) {
            return res.status(401).json({
                status: "error",
                message: "Invalid or expired token",
            });
        }
        const user = yield (0, user_model_1.getUserByPhoneAndJWT)({
            phone: decoded.phone,
            refreshJWT: token,
        });
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found or already signed out",
            });
        }
        const updatedUser = yield (0, user_model_1.signOutUserByPhoneANDJWT)(decoded.phone, { refreshJWT: token });
        if (updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._id) {
            return res.json({
                status: "success",
                message: "User signed out successfully",
            });
        }
        return res.status(500).json({
            status: "error",
            message: "Error signing out user",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signOutUser = signOutUser;
const OTPRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email_phone } = req.body;
        if (!email_phone)
            throw new Error("Email or Phone number required!");
        const user = yield (0, user_model_1.getUserByPhoneOrEmail)(email_phone);
        if (user === null || user === void 0 ? void 0 : user._id) {
            const otp = (0, randomGenerator_1.randomOTPGenerator)();
            const update = yield (0, user_model_1.UpdateUserByPhone)(user === null || user === void 0 ? void 0 : user.phone, { verificationCode: otp });
            if (update === null || update === void 0 ? void 0 : update._id) {
                return res.json({
                    status: "success",
                    message: `OTP has been sent to ${email_phone}`,
                    userEmail_Phone: email_phone
                });
            }
            return res.json({
                status: "error",
                message: `Failed to Send OPT`,
            });
        }
        return res.json({
            status: "error",
            message: `${email_phone} account doesn't exist in our system`,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.OTPRequest = OTPRequest;
const OTPVerification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email_phone, otp } = req.body;
        if (!email_phone)
            throw new Error("Email or Phone number required!");
        const user = yield (0, user_model_1.getUserByPhoneOrEmail)(email_phone);
        if (user === null || user === void 0 ? void 0 : user._id) {
            if ((user === null || user === void 0 ? void 0 : user.verificationCode) === otp) {
                yield (0, user_model_1.UpdateUserByPhone)(user === null || user === void 0 ? void 0 : user.phone, { verificationCode: "" });
                return res.json({
                    status: "success",
                    message: `OTP has been verified`,
                });
            }
            return res.json({
                status: "error",
                message: `OTP does not matched`,
            });
        }
        return res.json({
            status: "error",
            message: `${email_phone} account doesn't exist in our system`,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.OTPVerification = OTPVerification;
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email_phone, password } = req.body;
        if (!email_phone)
            throw new Error("Email or Phone number required!");
        const user = yield (0, user_model_1.getUserByPhoneOrEmail)(email_phone);
        if (user === null || user === void 0 ? void 0 : user._id) {
            const hass = (0, bcrypt_1.hashPassword)(password);
            const update = yield (0, user_model_1.UpdateUserByPhone)(user === null || user === void 0 ? void 0 : user.phone, { password: hass });
            if (update === null || update === void 0 ? void 0 : update._id) {
                return res.json({
                    status: "success",
                    message: `Password has been updated successfully`,
                });
            }
            return res.json({
                status: "error",
                message: `Failed to update password, please try again later!`,
            });
        }
        return res.json({
            status: "error",
            message: `${email_phone} account doesn't exist in our system`,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updatePassword = updatePassword;
const getUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({
            status: "success",
            user: req.userInfo,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserController = getUserController;
const getAllUsersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = Array.isArray(req.userInfo) ? req.userInfo : [];
        if (users.length === 0) {
            return res.json({
                status: "success",
                message: "No users found",
                user: [],
            });
        }
        res.json({
            status: "success",
            message: "All Users",
            users: users
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsersController = getAllUsersController;
const getAUserByPhoneController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone } = req.params;
        const user = yield (0, user_model_1.getUserByPhoneOrEmail)(phone);
        if (user === null || user === void 0 ? void 0 : user._id) {
            user.password = undefined;
            return res.json({
                status: "success",
                message: "Here is a user",
                user: user,
            });
        }
        return res.json({
            status: "error",
            message: "User not found",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAUserByPhoneController = getAUserByPhoneController;
const sendLinkController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const token = yield (0, jwt_1.createAccessJWT)(email);
        const messageId = yield (0, nodemailer_1.sendRegisterationLink)(email, token);
        messageId
            ? res.status(201).json({ status: "success", message: "Email sent" })
            : res.status(400).json({
                status: "error",
                message: "Failed To Send Message",
            });
    }
    catch (error) {
        next(error);
    }
});
exports.sendLinkController = sendLinkController;
