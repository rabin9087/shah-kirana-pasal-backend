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
exports.sendLinkController = exports.getAllUsersController = exports.getUserController = exports.updatePassword = exports.OTPVerification = exports.OTPRequest = exports.signOutUser = exports.loginUser = exports.updateUserProfile = exports.createNewUser = void 0;
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
        const decoded = (0, jwt_1.verifyRefreshJWT)(authorization);
        if (!authorization) {
            throw new Error("No Authorization provided");
        }
        if (authorization) {
            if (decoded === null || decoded === void 0 ? void 0 : decoded.phone) {
                yield (0, user_model_1.getUserByPhoneAndJWT)({
                    phone: decoded.phone,
                    refreshJWT: authorization,
                });
                yield (0, user_model_1.UpdateUserByPhone)(decoded.phone, { refreshJWT: "" });
                res.json({
                    status: "success",
                    message: "User signed out successfully",
                });
            }
        }
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
        const { email_phone, otp, password } = req.body;
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
    res.json({
        status: "success",
        message: `Welcome back ${req.userInfo}`,
        user: req.userInfo,
    });
});
exports.getUserController = getUserController;
const getAllUsersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = Array.isArray(req.userInfo) ? req.userInfo : [];
        console.log("Users: :", users);
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
            user: users
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsersController = getAllUsersController;
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
