import { NextFunction, Request, Response } from "express";
import {
  createAccessJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
} from "../utils/jwt";
import { CustomError } from "../../types";
import { getUserByPhoneOrEmail, getUserByPhoneAndJWT } from "../model/user/user.model";
import { findOneByFilterAndDelete } from "../model/session/session.model";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get access jwt key form the fornt end
    const { authorization } = req.headers;
    // decode the JWT which tell key is valid and expired or not
    const decoded = verifyAccessJWT(authorization as string);
    //decoded have three properties one of them being user phone expiry data
    // extrat phone and get get user by email
    if (decoded?.phone) {
      // check if the user is active
      const user = await getUserByPhoneOrEmail(decoded.phone);
      if (user?._id) {
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
  } catch (error: CustomError | any) {
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
};
export const newAdminSignUpAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get access jwt key form the fornt end
    const { authorization } = req.headers;
    if (!authorization) {
      return res.json({
        status: "error",
        message: "Unauthorized access",
      });
    }
    const decoded = verifyAccessJWT(authorization as string);
    if (!decoded?.phone) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized access",
        decoded,
      });
    }
    const session = await findOneByFilterAndDelete({
      associate: decoded.phone!,
      token: authorization!,
    });

    if (!session) {
      return res.status(401).send({
        status: "error",
        message: "Link expired. Please ask admin for a new link",
      });
    }
    req.body.role = "ADMIN";
    return next();
  } catch (error: CustomError | any) {
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
};
export const adminAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get access jwt key form the fornt end
    const { authorization } = req.headers;
    // decode the JWT which tell key is valid and expired or not
    const decoded = verifyAccessJWT(authorization as string);
    //decoded have three properties one of them being user phone expiry data
    // extrat phone and get get user by phone
    if (decoded?.phone) {
      // check if the user is active
      const user = await getUserByPhoneOrEmail(decoded.phone);
      if (user?._id && user.role === "ADMIN") {
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
  } catch (error: CustomError | any) {
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
};

export const refreshAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1.get  the refreshAuth
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Error("No Authorization provided");
    }
    // 2.decode the jwt
    const decoded = verifyRefreshJWT(authorization as string);
    // 3. extract phone and get user by phone
    if (decoded?.phone) {
      // 4. check fif the user is active
      const user = await getUserByPhoneAndJWT({
        phone: decoded.phone,
        refreshJWT: authorization,
      });

      if (user?._id) {
        // create new accessJWT
        const accessJWT = await createAccessJWT(decoded.phone);
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
  } catch (error: CustomError | any) {
    next(error);
  }
};
