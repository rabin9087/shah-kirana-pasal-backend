import axios from "axios";
import { NextFunction, Request, Response } from "express";
import Stripe from 'stripe'

const ZIP_API_URL = process.env.ZIP_ENVIRONMENT === 'sandbox'
  ? 'https://api.sandbox.zip.co/checkout'
  : 'https://api.zip.co/checkout';


export const createPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { amount, currency, paymentIntentId } = req.body;
        const stripe = new Stripe(process.env.STRIP_SECRET as string);
        
        // Fix: Convert amount to integer properly to avoid floating-point issues
        const amountInCents = Math.round(parseFloat(amount) * 100);
        
        console.log("Original amount:", amount);
        console.log("Amount in cents:", amountInCents);
        
        let paymentIntent;
        
        if (paymentIntentId) {
            try {
                paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

                if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'canceled') {
                    console.warn(`Attempted to update PaymentIntent ${paymentIntentId} which is in status: ${paymentIntent.status}. Creating a new one.`);
                    paymentIntent = await stripe.paymentIntents.create({
                        amount: amountInCents, // Use the fixed amount
                        currency: currency || 'aud',
                        payment_method_types: [
                            "card",
                            "afterpay_clearpay",
                            "zip",
                        ],
                    });
                } else {
                    paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
                        amount: amountInCents, // Use the fixed amount
                        currency: currency || 'aud',
                    });
                }
            } catch (error: any) {
                if (error.type === 'StripeInvalidRequestError') {
                    console.warn(`PaymentIntent ${paymentIntentId} not found or invalid. Creating a new one.`);
                    paymentIntent = await stripe.paymentIntents.create({
                        amount: amountInCents, // Use the fixed amount
                        currency: currency || 'aud',
                        payment_method_types: [
                            "card",
                            "afterpay_clearpay",
                            "zip",
                        ],
                    });
                } else {
                    throw error;
                }
            }
        } else {
            paymentIntent = await stripe.paymentIntents.create({
                amount: amountInCents, // Use the fixed amount
                currency: currency || 'aud',
                payment_method_types: [
                    "card",
                    "afterpay_clearpay",
                    "zip",
                ],
            });
        }

        return res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error("Error in createPayment:", error);
        next(error);
    }
};

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