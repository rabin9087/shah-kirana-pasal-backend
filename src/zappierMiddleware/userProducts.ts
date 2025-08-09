import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../model/user/user.schema";

export const showUserProducts = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const userData = req.userInfo as IUser
        const { cartHistory } = userData
        console.log("cart History: ",cartHistory.map((item) => item.items.map((pro) => pro.productId)))
        if (userData) {
            const cartHistory = userData
            const productSuggestUser = process.env.ZAPIER_WEBHOOK_URL_productSuggestUser
            const verify = await axios.post(productSuggestUser, {
                cartHistory
                });
        }
        return res.json({
          status: "success",
          message: "Authorized",
          accessJWT: req.accessJWT,
          user: req.userInfo,
        });
    } catch (error) {
        next(error)
    }
}