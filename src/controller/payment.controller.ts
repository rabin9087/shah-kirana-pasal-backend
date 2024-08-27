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
    automatic_payment_methods: {
        enabled: true,
        },
    });
    
return res.json({
        clientSecret: paymentIntents.client_secret
    })
}