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
exports.refreshAuth = exports.adminAccess = exports.auth = void 0;
const jwt_1 = require("../utils/jwt");
const user_model_1 = require("../model/user/user.model");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get access jwt key form the fornt end
        const { authorization } = req.headers;
        // decode the JWT which tell key is valid and expired or not
        const decoded = (0, jwt_1.verifyAccessJWT)(authorization);
        //decoded have three properties one of them being user email expiry data
        // extrat email and get get user by email
        if (decoded === null || decoded === void 0 ? void 0 : decoded.email) {
            // check if the user is active
            const user = yield (0, user_model_1.getUserByEmail)(decoded.email);
            if (user === null || user === void 0 ? void 0 : user._id) {
                user.refreshJWT = undefined;
                user.password = undefined;
                req.userInfo = user;
                return next();
            }
        }
        res.status(401).json({
            status: "error",
            message: "Unauthorized access",
        });
    }
    catch (error) {
        if (error.message.includes("jwt expired")) {
            error.statusCode = 403;
            error.message = "Your token has expired. Please login Again";
        }
        if (error.message.includes("invalid signature")) {
            error.statusCode = 401;
            error.message = error.message;
        }
        next(error);
    }
});
exports.auth = auth;
const adminAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get access jwt key form the fornt end
        const { authorization } = req.headers;
        // decode the JWT which tell key is valid and expired or not
        const decoded = (0, jwt_1.verifyAccessJWT)(authorization);
        //decoded have three properties one of them being user email expiry data
        // extrat email and get get user by email
        if (decoded === null || decoded === void 0 ? void 0 : decoded.email) {
            // check if the user is active
            const user = yield (0, user_model_1.getUserByEmail)(decoded.email);
            if ((user === null || user === void 0 ? void 0 : user._id) && user.role === 'ADMIN') {
                user.refreshJWT = undefined;
                user.password = undefined;
                req.userInfo = user;
                return next();
            }
        }
        res.status(401).json({
            status: "error",
            message: "Unauthorized access",
        });
    }
    catch (error) {
        if (error.message.includes("jwt expired")) {
            error.statusCode = 403;
            error.message = "Your token has expired. Please login Again";
        }
        if (error.message.includes("invalid signature")) {
            error.statusCode = 401;
            error.message = error.message;
        }
        next(error);
    }
});
exports.adminAccess = adminAccess;
const refreshAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1.get  the refreshAuth
        const { authorization } = req.headers;
        if (!authorization) {
            throw new Error("No Authorization provided");
        }
        // 2.decode the jwt
        const decoded = (0, jwt_1.verifyRefreshJWT)(authorization);
        // 3. extract email and get user by email
        if (decoded === null || decoded === void 0 ? void 0 : decoded.email) {
            // 4. check fif the user is active
            const user = yield (0, user_model_1.getUserByEmailAndJWT)({
                email: decoded.email,
                refreshJWT: authorization,
            });
            if (user === null || user === void 0 ? void 0 : user._id) {
                // create new accessJWT
                const accessJWT = yield (0, jwt_1.createAccessJWT)(decoded.email);
                return res.json({
                    status: "success",
                    message: "Session expired!!.Please login Again.",
                    accessJWT,
                });
            }
        }
        res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.refreshAuth = refreshAuth;
