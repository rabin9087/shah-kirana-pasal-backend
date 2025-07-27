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
exports.refreshAuth = exports.PickerAccess = exports.storeSalerAccess = exports.superAdminAccess = exports.adminAccess = exports.newAdminSignUpAuth = exports.auth = void 0;
const jwt_1 = require("../utils/jwt");
const user_model_1 = require("../model/user/user.model");
const session_model_1 = require("../model/session/session.model");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                status: "error",
                message: "Authorization token missing",
            });
        }
        const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : authorization;
        const decoded = (0, jwt_1.verifyAccessJWT)(token);
        if (decoded === null || decoded === void 0 ? void 0 : decoded.phone) {
            const user = yield (0, user_model_1.getUserByPhoneOrEmail)(decoded.phone);
            if (user === null || user === void 0 ? void 0 : user._id) {
                user.password = undefined;
                user.refreshJWT = undefined;
                user.verificationCode = undefined;
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
const newAdminSignUpAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                status: "error",
                message: "Authorization token missing",
            });
        }
        const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : authorization;
        const decoded = (0, jwt_1.verifyAccessJWT)(token);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.phone)) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized access",
                decoded,
            });
        }
        const session = yield (0, session_model_1.findOneByFilterAndDelete)({
            associate: decoded.phone,
            token: token,
        });
        if (!session) {
            return res.status(401).send({
                status: "error",
                message: "Link expired. Please ask admin for a new link",
            });
        }
        req.body.role = "ADMIN";
        return next();
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
exports.newAdminSignUpAuth = newAdminSignUpAuth;
const adminAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                status: "error",
                message: "Authorization token missing",
            });
        }
        const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : authorization;
        const decoded = (0, jwt_1.verifyAccessJWT)(token);
        if (decoded === null || decoded === void 0 ? void 0 : decoded.phone) {
            const user = yield (0, user_model_1.getUserByPhoneOrEmail)(decoded.phone);
            if ((user === null || user === void 0 ? void 0 : user.role) === "ADMIN" || (user === null || user === void 0 ? void 0 : user.role) === "SUPERADMIN") {
                const users = yield (0, user_model_1.getAllUser)();
                req.userInfo = users;
                return next();
            }
        }
        res.status(403).json({
            status: "error",
            message: "Forbidden: Only admin can access this resource.",
        });
    }
    catch (error) {
        if (error.message.includes("jwt expired")) {
            error.statusCode = 403;
            error.message = "Your token has expired. Please login again.";
        }
        if (error.message.includes("invalid signature")) {
            error.statusCode = 401;
            error.message = "Invalid token signature.";
        }
        next(error);
    }
});
exports.adminAccess = adminAccess;
const superAdminAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                status: "error",
                message: "Authorization token missing",
            });
        }
        const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : authorization;
        const decoded = (0, jwt_1.verifyAccessJWT)(token);
        if (decoded === null || decoded === void 0 ? void 0 : decoded.phone) {
            const user = yield (0, user_model_1.getUserByPhoneOrEmail)(decoded.phone);
            if ((user === null || user === void 0 ? void 0 : user.role) === "SUPERADMIN") {
                const users = yield (0, user_model_1.getAllUser)();
                req.userInfo = users;
                return next();
            }
        }
        res.status(403).json({
            status: "error",
            message: "Forbidden: Only admin can access this resource.",
        });
    }
    catch (error) {
        if (error.message.includes("jwt expired")) {
            error.statusCode = 403;
            error.message = "Your token has expired. Please login again.";
        }
        if (error.message.includes("invalid signature")) {
            error.statusCode = 401;
            error.message = "Invalid token signature.";
        }
        next(error);
    }
});
exports.superAdminAccess = superAdminAccess;
const storeSalerAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                status: "error",
                message: "Authorization token missing",
            });
        }
        const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : authorization;
        const decoded = (0, jwt_1.verifyAccessJWT)(token);
        if (decoded === null || decoded === void 0 ? void 0 : decoded.phone) {
            const user = yield (0, user_model_1.getUserByPhoneOrEmail)(decoded.phone);
            if ((user === null || user === void 0 ? void 0 : user.role) === "ADMIN" || (user === null || user === void 0 ? void 0 : user.role) === "STOREUSER" || (user === null || user === void 0 ? void 0 : user.role) === "SUPERADMIN") {
                const users = yield (0, user_model_1.getAllUser)();
                req.userInfo = users;
                return next();
            }
        }
        res.status(403).json({
            status: "error",
            message: "Forbidden: Only admin can access this resource.",
        });
    }
    catch (error) {
        if (error.message.includes("jwt expired")) {
            error.statusCode = 403;
            error.message = "Your token has expired. Please login again.";
        }
        if (error.message.includes("invalid signature")) {
            error.statusCode = 401;
            error.message = "Invalid token signature.";
        }
        next(error);
    }
});
exports.storeSalerAccess = storeSalerAccess;
const PickerAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                status: "error",
                message: "Authorization token missing",
            });
        }
        const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : authorization;
        const decoded = (0, jwt_1.verifyAccessJWT)(token);
        if (decoded === null || decoded === void 0 ? void 0 : decoded.phone) {
            const user = yield (0, user_model_1.getUserByPhoneOrEmail)(decoded.phone);
            if ((user === null || user === void 0 ? void 0 : user.role) === "ADMIN" || (user === null || user === void 0 ? void 0 : user.role) === "PICKER" || (user === null || user === void 0 ? void 0 : user.role) === "SUPERADMIN") {
                const users = yield (0, user_model_1.getAllUser)();
                req.userInfo = users;
                return next();
            }
        }
        res.status(403).json({
            status: "error",
            message: "Forbidden: Only admin or picker can access this resource.",
        });
    }
    catch (error) {
        if (error.message.includes("jwt expired")) {
            error.statusCode = 403;
            error.message = "Your token has expired. Please login again.";
        }
        if (error.message.includes("invalid signature")) {
            error.statusCode = 401;
            error.message = "Invalid token signature.";
        }
        next(error);
    }
});
exports.PickerAccess = PickerAccess;
const refreshAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ status: "error", message: "No Authorization provided" });
        }
        const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : authorization;
        try {
            const accessDecoded = (0, jwt_1.verifyAccessJWT)(token);
            if (accessDecoded === null || accessDecoded === void 0 ? void 0 : accessDecoded.phone) {
                const userToken = yield (0, session_model_1.CheckUserByToken)({ associate: accessDecoded.phone, token });
                if (userToken === null || userToken === void 0 ? void 0 : userToken._id) {
                    const user = yield (0, user_model_1.getUserByPhoneOrEmail)(accessDecoded.phone);
                    if (user === null || user === void 0 ? void 0 : user._id) {
                        user.password = undefined;
                        user.verificationCode = undefined;
                        user.refreshJWT = undefined;
                        return res.json({
                            status: "success",
                            message: "Authorized",
                            user,
                        });
                    }
                }
            }
        }
        catch (error) {
            console.log("Access JWT verification failed, attempting Refresh JWT...");
        }
        const decoded = (0, jwt_1.verifyRefreshJWT)(token);
        if (decoded === null || decoded === void 0 ? void 0 : decoded.phone) {
            const user = yield (0, user_model_1.getUserByPhoneAndJWT)({
                phone: decoded.phone,
                refreshJWT: token,
            });
            if (user === null || user === void 0 ? void 0 : user._id) {
                user.password = undefined;
                const accessJWT = yield (0, jwt_1.createAccessJWT)(decoded.phone);
                user.refreshJWT = (_a = user.refreshJWT) === null || _a === void 0 ? void 0 : _a.filter((refreshToken) => refreshToken === token);
                return res.json({
                    status: "success",
                    message: "Authorized",
                    accessJWT,
                    user,
                });
            }
        }
        return res.status(401).json({
            status: "error",
            message: "Unauthorized",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.refreshAuth = refreshAuth;
