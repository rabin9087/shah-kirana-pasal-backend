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
exports.createTokenForAdmin = exports.getUser = exports.loginUser = exports.createNewUser = void 0;
const user_model_1 = require("../model/user/user.model");
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const createNewUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.userInfo) === null || _a === void 0 ? void 0 : _a.role) === 'ADMIN') {
            req.body.role = 'ADMIN';
        }
        const { password } = req.body;
        req.body.password = (0, bcrypt_1.hashPassword)(password);
        const newUser = yield (0, user_model_1.createUser)(req.body);
        newUser.password = undefined;
        (newUser === null || newUser === void 0 ? void 0 : newUser._id)
            ? res.json({
                status: 'success',
                message: 'Please check your email to verify your account',
                newUser
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
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            throw new Error("Missing credentials.");
        // Find a user with the provided email address
        const user = yield (0, user_model_1.getUserByEmail)(email);
        if (!user) {
            return res
                .status(401)
                .json({ status: "error", message: "No User Found." });
        }
        // Verify the password of the user with the one sent in the request body
        const isValidPassword = (0, bcrypt_1.validatePassword)(password, user.password);
        if (!isValidPassword)
            return res
                .status(401)
                .send({ status: "error", message: "Wrong password." });
        // If everything goes well, send the token to the client
        // todo send jwt tokens to the user
        return res.json({
            status: "success",
            message: `Welcome back ${user.fName}`,
            tokens: {
                accessJWT: yield (0, jwt_1.createAccessJWT)(user.email),
                refreshJWT: yield (0, jwt_1.createRefreshJWT)(user.email),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        user: req.userInfo
    });
});
exports.getUser = getUser;
const createTokenForAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.params.email;
        const token = yield (0, jwt_1.createAccessJWT)(email);
        const link = `http://${process.env.WEB_DOMAIN}/sign-up?email=${email}&&token=${token}`;
        //  todo send this link to the user email address
        // if email is sent i.e nodemailer gives you id
        res.json({
            status: 'success',
            message: 'Link has been sent'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createTokenForAdmin = createTokenForAdmin;
