import { NextFunction, Request, Response } from "express";
import Stripe from 'stripe'

export const createPayment = async(
    req: Request,
    res: Response,
    next: NextFunction) => {
   const {amount, currency} = req.body
    const stripe = new Stripe(process.env.STRIP_SECRET)

    const paymentIntents = await stripe.paymentIntents.create({
    amount: parseInt(amount) * 100,
        currency: currency,
        payment_method_types: ["card", "afterpay_clearpay", "zip"],
    // return_url: "http://localhost:5173/payment/success" || "https://www.shahkiranapasal.shop/payment/success",
    });
    
return res.json({
        clientSecret: paymentIntents.client_secret
    })
}