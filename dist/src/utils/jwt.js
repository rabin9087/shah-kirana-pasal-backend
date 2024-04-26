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
exports.verifyRefreshJWT = exports.createRefreshJWT = exports.verifyAccessJWT = exports.createAccessJWT = void 0;
// import
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const session_model_1 = require("../model/session/session.model");
const user_model_1 = require("../model/user/user.model");
const createAccessJWT = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "1d",
        });
        yield (0, session_model_1.insertNewSession)({ token, associate: email });
        return token;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.createAccessJWT = createAccessJWT;
const verifyAccessJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
};
exports.verifyAccessJWT = verifyAccessJWT;
//// create refreshJWT and store with user data in user table: long live 30d
const createRefreshJWT = (email) => __awaiter(void 0, void 0, void 0, function* () {
    ///expires every 30days
    const refreshJWT = jsonwebtoken_1.default.sign({ email }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "15d",
    });
    yield (0, user_model_1.UpdateUserByEmail)(email, { refreshJWT });
    return refreshJWT;
});
exports.createRefreshJWT = createRefreshJWT;
const verifyRefreshJWT = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
};
exports.verifyRefreshJWT = verifyRefreshJWT;
