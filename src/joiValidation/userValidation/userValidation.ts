import { NextFunction, Request, Response } from "express";
import { EMAILREQUIRED, JoiValidationProcess, PHONEREQUIRED, SORTSTR, SORTSTRREQUIRED } from "../joiValidation";

export const signupValidation = (
    req: Request,
  res: Response,
  next: NextFunction
) => {
    const schemaObj = {
        fName: SORTSTRREQUIRED,
        lName: SORTSTRREQUIRED,
        email: EMAILREQUIRED,
        phone: PHONEREQUIRED,
        password: SORTSTRREQUIRED,
        address: SORTSTR.optional(),
    };
    return JoiValidationProcess({ schemaObj, req, res, next });
}

export const loginValidation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const schemaObj = {
        email_phone: SORTSTRREQUIRED,
        password: SORTSTRREQUIRED,
    };
    return JoiValidationProcess({ schemaObj, req, res, next });
}

export const verifyEmailValidation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const schemaObj = {
        email: SORTSTRREQUIRED,
        token: SORTSTRREQUIRED,
    };
    
    return JoiValidationProcess({ schemaObj, req, res, next });

}