import { NextFunction, Request, Response } from "express";
import { AuthHeaderSchema, EMAILREQUIRED, JoiValidationProcess, PHONEREQUIRED, SORTSTR, SORTSTRREQUIRED } from "../joiValidation";

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

export const validateAuthHeader = (req: Request, res: Response, next: NextFunction) => {
  const { error } = AuthHeaderSchema.validate(req.headers);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
  next();
};