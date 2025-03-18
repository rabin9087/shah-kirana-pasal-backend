import twilio from 'twilio'
import { NextFunction, Request, Response } from "express";
import { UpdateUserByPhone, UpdateUserCartHistoryByPhone, createUser, getUserByPhoneAndJWT, getUserByPhoneOrEmail, signOutUserByPhoneANDJWT } from "../model/user/user.model";
import { hashPassword, validatePassword } from "../utils/bcrypt";
import {
  createAccessJWT,
  createRefreshJWT,
  verifyRefreshJWT,
} from "../utils/jwt";
import { sendRegisterationLink } from "../utils/nodemailer";
import { randomOTPGenerator } from "../utils/randomGenerator";
import { IUser } from '../model/user/user.schema';

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

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.MulterS3.File[] };
      if (files["profile"]) {
        req.body.profile = files["profile"][0].location; // Save the image URL
      }
    } else {
      return res.status(400).json({ status: "error", message: "No file uploaded." });
    }
    // Validate user phone before updating
    if (!req.body.phone) {
      return res.status(400).json({ status: "error", message: "Phone number is required." });
    }
    
    // Update the user profile
    const updatedUser = await UpdateUserByPhone(req.body.phone, { profile: req.body.profile });
    
    if (updatedUser?._id) {
      res.json({
        status: "success",
        message: "Profile updated successfully!",
        data: updatedUser,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "Failed to update profile.",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateAUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.params;

    // Update the user profile
    const updatedUser = await UpdateUserByPhone(phone, req.body );
    if (updatedUser?._id) {
      updatedUser.password = undefined
      res.json({
        status: "success",
        message: "Profile updated successfully!",
        data: updatedUser,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "Failed to update profile.",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateUserCartController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUserCart = await UpdateUserByPhone(req.body.phone, { cart: req.body.cart });
    if (updatedUserCart?._id) {
      res.json({
        status: "success",
        message: "Cart updated successfully!",
        data: updatedUserCart,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "Failed to update profile.",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateUserCartHistoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, cartHistory, amount, orderNumber, paymentStatus, deliveryStatus } = req.body;
    const updatedUserCartHistory = await UpdateUserCartHistoryByPhone(phone, cartHistory, amount, orderNumber, paymentStatus, deliveryStatus );
    if (updatedUserCartHistory?._id) {
      res.json({
        status: "success",
        message: "Cart updated successfully!",
        data: updatedUserCartHistory,
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "Failed to update profile.",
      });
    }
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
    // 
    const { email_phone, password } = req.body;
    if (!email_phone || !password) throw new Error("Missing credentials.");
    // Find a user with the provided email  address or phone number
    const user = await getUserByPhoneOrEmail(email_phone);
    
    //if not user found, response not user found with requested email or phone
    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: `No user found with ${email_phone}` });
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
      message: `Welcome back ${user.fName} !`,
      tokens: {
        accessJWT: await createAccessJWT((user.phone ? user.phone : user.email) as string),
        refreshJWT: await createRefreshJWT((user.phone ? user.phone : user.email) as string),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOutUser = async (
  req: Request,
  res: Response, 
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;

    // 1. Check if authorization header exists
    if (!authorization) {
      return res.status(401).json({
        status: "error",
        message: "No Authorization provided",
      });
    }
    const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : authorization;

    // 2. Decode the JWT token
    const decoded = verifyRefreshJWT(token);
    if (!decoded || !decoded.phone) {
      return res.status(401).json({
        status: "error",
        message: "Invalid or expired token",
      });
    }

    // 3. Retrieve user by phone and refresh token
    const user = await getUserByPhoneAndJWT({
      phone: decoded.phone,
      refreshJWT: token,
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found or already signed out",
      });
    }

    // 4. Sign out user
    const updatedUser = await signOutUserByPhoneANDJWT(decoded.phone, { refreshJWT: token });

    if (updatedUser?._id) {
      return res.json({
        status: "success",
        message: "User signed out successfully",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Error signing out user",
    });

  } catch (error) {
    next(error);
  }
};
  
export const OTPRequest = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {email_phone} = req.body
    //find user with provided email or phone 
    if(!email_phone) throw new Error("Email or Phone number required!")
      const user = await getUserByPhoneOrEmail(email_phone)
    if(user?._id){
      //generate otp and update user's
      const otp = randomOTPGenerator()
     const update = await UpdateUserByPhone(user?.phone!, {verificationCode: otp})
     if(update?._id){
      return res.json({
        status: "success",
        message: `OTP has been sent to ${email_phone}`,
        userEmail_Phone: email_phone
      });
     }
     return res.json({
      status: "error",
      message: `Failed to Send OPT`,
      
    })
    }
    return res.json({
      status: "error",
      message: `${email_phone} account doesn't exist in our system`,
    })
  } catch (error) {
    next(error)
  }
}

export const OTPVerification = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {email_phone, otp} = req.body
    //find user with provided email or phone 
    if(!email_phone) throw new Error("Email or Phone number required!")
      const user = await getUserByPhoneOrEmail(email_phone)
    if(user?._id){
      //generate otp and update user's
      if(user?.verificationCode === otp){
      await UpdateUserByPhone(user?.phone!, {verificationCode: ""})
         return res.json({
           status: "success",
           message: `OTP has been verified`,
         });
      }
    
     return res.json({
      status: "error",
      message: `OTP does not matched`,
      
    })
    }
    return res.json({
      status: "error",
      message: `${email_phone} account doesn't exist in our system`,
    })
  } catch (error) {
    next(error)
  }
}

export const updatePassword = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {email_phone, password} = req.body
    //find user with provided email or phone 
    if(!email_phone) throw new Error("Email or Phone number required!")
      const user = await getUserByPhoneOrEmail(email_phone)
    if(user?._id){
      // update user's password
        const hass = hashPassword(password)
        const update = await UpdateUserByPhone(user?.phone!, {password: hass})
        if(update?._id){
   
         return res.json({
           status: "success",
           message: `Password has been updated successfully`,
         });
        }
     return res.json({
      status: "error",
      message: `Failed to update password, please try again later!`,
      
    })
    }
    return res.json({
      status: "error",
      message: `${email_phone} account doesn't exist in our system`,
    })
  } catch (error) {
    next(error)
  }
}

export const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
     res.json({
    status: "success",
    user: req.userInfo,
  });
  } catch (error) {
    next(error)
  }
 
};

export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Ensure req.userInfo is defined and is an array of IUser
    const users: IUser[] =  Array.isArray(req.userInfo) ? req.userInfo : [];
    // If no users are found, return an appropriate response
    if (users.length === 0) {
      return res.json({
        status: "success",
        message: "No users found",
        user: [],
      });
    }

    // Send the response with the users
    res.json({
      status: "success",
      message: "All Users",
      users: users
    });
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
};

export const getAUserByPhoneController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  const  {phone}  = req.params;
  const user = await getUserByPhoneOrEmail(phone)
    if (user?._id) {
      user.password = undefined
    return res.json({
      status: "success",
      message: "Here is a user",
      user: user,
    })
  }
     
  return res.json({
    status: "error",
    message: "User not found",
  })
  } catch (error) {
    next(error)
  }

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
