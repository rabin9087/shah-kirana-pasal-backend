"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthHeaderSchema = exports.JoiValidationProcess = exports.DATEREQUIRED = exports.DATE = exports.BOOLEAN = exports.PASSWORDREQUIRED = exports.PHONEREQUIRED = exports.PHONE = exports.EMAILREQUIRED = exports.EMAIL = exports.NUMBERREQUIRED = exports.NUMBER = exports.LONGSTRREQUIRED = exports.LONGSTR = exports.SORTSTRREQUIRED = exports.SORTSTR = void 0;
const joi_1 = __importDefault(require("joi"));
exports.SORTSTR = joi_1.default.string().allow("", null);
exports.SORTSTRREQUIRED = joi_1.default.string().max(200).required();
exports.LONGSTR = joi_1.default.string().max(500).required().allow("", null);
exports.LONGSTRREQUIRED = joi_1.default.string().max(5000).required();
exports.NUMBER = joi_1.default.number().required().allow("", null);
exports.NUMBERREQUIRED = joi_1.default.number().required();
exports.EMAIL = joi_1.default.string().lowercase().email({ minDomainSegments: 2 }).allow("", null);
exports.EMAILREQUIRED = joi_1.default.string().lowercase().email({ minDomainSegments: 2 }).required();
exports.PHONE = joi_1.default.string().allow("", null);
exports.PHONEREQUIRED = joi_1.default.string().allow("", null);
exports.PASSWORDREQUIRED = joi_1.default.string().min(5).required();
exports.BOOLEAN = joi_1.default.boolean().required();
exports.DATE = joi_1.default.date().allow("", null);
exports.DATEREQUIRED = joi_1.default.date().required();
const JoiValidationProcess = ({ schemaObj, req, res, next }) => {
    try {
        const schema = joi_1.default.object(schemaObj);
        const { error } = schema.validate(req.body);
        if (error) {
            return res.json({
                status: "error",
                message: error.message
            });
        }
        next();
    }
    catch (error) {
        console.log(error);
        next(error);
    }
};
exports.JoiValidationProcess = JoiValidationProcess;
exports.AuthHeaderSchema = joi_1.default.object({
    authorization: joi_1.default.string()
        .pattern(/^Bearer\s+[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
        .required()
        .messages({
        "string.empty": "Authorization header is required.",
        "string.pattern.base": "Invalid Authorization token format. Expected: Bearer <token>",
    }),
}).unknown(true);
