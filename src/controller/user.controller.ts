import { NextFunction, Request, Response } from "express";
import { createUser, getUserByEmail } from "../model/user/user.model";
import { hashPassword, validatePassword } from "../utils/bcrypt";
import { createAccessJWT, createRefreshJWT } from "../utils/jwt";

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body;
    req.body.password = hashPassword(password);
    const newUser = await createUser(req.body);
    newUser?._id
      ? res.json({
          user: req.body,
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
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Missing credentials.");
    // Find a user with the provided email address
    const user = await getUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "No User Found." });
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
      tokens: {
        accessJWT: createAccessJWT(user.email),
        refreshJWT: createRefreshJWT(user.email),
      },
    });
  } catch (error) {
    next(error);
  }
};
