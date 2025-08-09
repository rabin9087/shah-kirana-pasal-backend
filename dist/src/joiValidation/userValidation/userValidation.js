"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailValidation = exports.loginValidation = exports.signupValidation = void 0;
const joiValidation_1 = require("../joiValidation");
const signupValidation = (req, res, next) => {
    const schemaObj = {
        fName: joiValidation_1.SORTSTRREQUIRED,
        lName: joiValidation_1.SORTSTRREQUIRED,
        email: joiValidation_1.EMAILREQUIRED,
        phone: joiValidation_1.PHONEREQUIRED,
        password: joiValidation_1.SORTSTRREQUIRED,
        address: joiValidation_1.SORTSTR.optional(),
    };
    return (0, joiValidation_1.JoiValidationProcess)({ schemaObj, req, res, next });
};
exports.signupValidation = signupValidation;
const loginValidation = (req, res, next) => {
    const schemaObj = {
        email_phone: joiValidation_1.SORTSTRREQUIRED,
        password: joiValidation_1.SORTSTRREQUIRED,
    };
    return (0, joiValidation_1.JoiValidationProcess)({ schemaObj, req, res, next });
};
exports.loginValidation = loginValidation;
const verifyEmailValidation = (req, res, next) => {
    const schemaObj = {
        email: joiValidation_1.SORTSTRREQUIRED,
        token: joiValidation_1.SORTSTRREQUIRED,
    };
    return (0, joiValidation_1.JoiValidationProcess)({ schemaObj, req, res, next });
};
exports.verifyEmailValidation = verifyEmailValidation;
