import axios from "axios";
import { NextFunction, Request, Response } from "express";
import Stripe from 'stripe'

const ZIP_API_URL = process.env.ZIP_ENVIRONMENT === 'sandbox'
  ? 'https://api.sandbox.zip.co/checkout'
  : 'https://api.zip.co/checkout';


export const createPayment = async(
    req: Request,
    res: Response,
  next: NextFunction) => {
  try {
     const {amount, currency} = req.body
    const stripe = new Stripe(process.env.STRIP_SECRET)

    const paymentIntents = await stripe.paymentIntents.create({
     amount: parseInt(amount) * 100, // convert to cents
      currency,
      payment_method_types: [
        "card",              // Google Pay & Apple Pay use card tokens
        "afterpay_clearpay",
      ], });
    
return res.json({
        clientSecret: paymentIntents.client_secret
    })
  } catch (error) {
    next(error)
  }
}

export const createZipCheckout = async (
  req: Request,
  res: Response,
  next: NextFunction) => { 
  
  try {
    const { amount, currency, orderReference, redirectUrl } = req.body;

    const response = await axios.post(
      `${ZIP_API_URL}/checkouts`,
      {
        amount,
        currency,
        orderReference,
        redirectUrl,
        merchantId: process.env.ZIP_MERCHANT_ID,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.ZIP_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error creating Zip checkout:', error);
    res.status(500).json({ error: 'Failed to create Zip checkout' });
  }
  }