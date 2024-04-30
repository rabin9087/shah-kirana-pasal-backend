import { NextFunction, Request, Response } from "express";
import { createUser, getUserByEmail } from "../model/user/user.model";
import { hashPassword, validatePassword } from "../utils/bcrypt";
import {
  createAccessJWT,
  createRefreshJWT,
  verifyAccessJWT,
} from "../utils/jwt";
import { sendRegisterationLink } from "../utils/nodemailer";

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body;
    req.body.password = hashPassword(password);
    const newUser = await createUser(req.body);
    newUser.password = undefined;
    newUser?._id
      ? res.json({
          status: "success",
          message: "Please check your email to verify your account",
          data: newUser,
        })
      : res.json({
          status: "error",
          message: "Error creating the account.",
        });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response, 
  next: NextFunction
) => {
  try {
    
    const { email_phone, password } = req.body;
    if (!email_phone || !password) throw new Error("Missing credentials.");
    // Find a user with the provided email address
    const user = await getUserByEmail(email_phone);
    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "No user found with such email" });
    }

    // Verify the password of the user with the one sent in the request body
    const isValidPassword = validatePassword(password, user.password as string);
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
        accessJWT: await createAccessJWT(user.phone),
        refreshJWT: await createRefreshJWT(user.phone),
      },
    });
  } catch (error) {
    next(error);
  }
};
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({
    status: "success",
    message: `Welcome back ${req.userInfo?.fName}`,
    user: req.userInfo,
  });
};

export const sendLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const token = await createAccessJWT(email);
    const messageId = await sendRegisterationLink(email, token);

    messageId
      ? res.status(201).json({ status: "success", message: "Email sent" })
      : res.status(400).json({
          status: "error",
          message: "Failed To Send Message",
        });
  } catch (error) {
    next(error);
  }
};
