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
        const { amount, currency, paymentIntentId } = req.body; // Use paymentIntentId
        const stripe = new Stripe(process.env.STRIP_SECRET as string);

        let paymentIntent;

        if (paymentIntentId) { // If a paymentIntentId is provided, try to update it
            try {
                paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

                // Check if the paymentIntent is in a state that allows modification
                if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'canceled') {
                    // If it's already succeeded or canceled, create a new one
                    console.warn(`Attempted to update PaymentIntent ${paymentIntentId} which is in status: ${paymentIntent.status}. Creating a new one.`);
                    paymentIntent = await stripe.paymentIntents.create({
                        amount: amount * 100,
                        currency: currency || 'aud', // Ensure currency is passed or default
                        payment_method_types: [
                            "card",
                            "afterpay_clearpay",
                            "zip",
                        ],
                        // You might want to add customer, description, or other metadata here
                    });
                } else {
                    // Update the existing PaymentIntent
                    paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
                        amount: amount * 100, // cents
                        currency: currency || 'aud', // Ensure currency is consistent
                        // You can also update description, metadata, shipping, etc.
                        // payment_method_types: [
                        //     "card",
                        //     "afterpay_clearpay",
                        //     "zip",
                        // ], // Only update if you specifically want to change allowed payment methods
                    });
                }
            } catch (error: any) {
                // If retrieve fails (e.g., ID not found), create a new one
                if (error.type === 'StripeInvalidRequestError') {
                    console.warn(`PaymentIntent ${paymentIntentId} not found or invalid. Creating a new one.`);
                    paymentIntent = await stripe.paymentIntents.create({
                        amount: amount * 100,
                        currency: currency || 'aud',
                        payment_method_types: [
                            "card",
                            "afterpay_clearpay",
                            "zip",
                        ],
                    });
                } else {
                    throw error; // Re-throw other errors
                }
            }
        } else {
            // Create new PaymentIntent if no ID is provided (first time)
            paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: currency || 'aud',
                payment_method_types: [
                    "card",
                    "afterpay_clearpay",
                    "zip",
                ],
                // customer: req.body.customer // Consider linking to a Stripe Customer ID
            });
        }

        return res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id, // Send back the ID
        });
    } catch (error) {
        console.error("Error in createPayment:", error);
        next(error);
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