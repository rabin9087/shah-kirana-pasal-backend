import { NextFunction, Request, Response } from "express";
import Stripe from 'stripe'

export const createPayment = async(
    req: Request,
    res: Response,
    next: NextFunction) => {
   const {amount, currency} = req.body
    const stripe = new Stripe(process.env.STRIP_SECRET)

    const paymentIntents = await stripe.paymentIntents.create({
     amount: parseInt(amount) * 100, // convert to cents
      currency,
      payment_method_types: [
        "card",              // Google Pay & Apple Pay use card tokens
          "afterpay_clearpay",
        "zip"  // Stripe supports Afterpay
        // ⚠️ "zippay" is NOT a valid Stripe method
      ], });
    
return res.json({
        clientSecret: paymentIntents.client_secret
    })
}