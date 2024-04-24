import { NextFunction, Request, Response } from "express";
import { createUser, getUserByEmail } from "../model/user/user.model";
import { hashPassword, validatePassword } from "../utils/bcrypt";
import { createAccessJWT, createRefreshJWT, verifyAccessJWT } from "../utils/jwt";

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
      
    if (req.userInfo?.role==='ADMIN') {
      req.body.role='ADMIN'
    }
    const { password } = req.body;
    req.body.password = hashPassword(password);
    const newUser = await createUser(req.body);
    newUser.password=undefined
    newUser?._id
      ? res.json({
        status:'success',
        message:'Please check your email to verify your account',
         newUser
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
      message:`Welcome back ${user.fName}`,
      tokens: {
        accessJWT:await createAccessJWT(user.email),
        refreshJWT: await createRefreshJWT(user.email),
      },
    });
  } catch (error) {
    next(error);
  }
};
export const getUser=async(  req: Request,
  res: Response,
  next: NextFunction)=>{
    res.json({
      user:req.userInfo
    })

}

export const createTokenForAdmin=async( req: Request,
  res: Response,
  next: NextFunction)=>{
  try {
    const email=req.params.email
    const token=await createAccessJWT(email)
   const link=`http://${process.env.WEB_DOMAIN}/sign-up?email=${email}&&token=${token}`

  //  todo send this link to the user email address
  // if email is sent i.e nodemailer gives you id
  res.json({
    status:'success',
    message:'Link has been sent'
  })
  } catch (error) {
    next(error)
  }
}

