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
        "zip",
      ],
      // customer: req.body.customer
      // automatic_payment_methods: { enabled: true },
      // shipping: {
      //   name: req.body.name,
      //   address: req.body.address,
      //   phone: req.body.phone,
      // }
    });

    // const customerSession = await stripe.customerSessions.create({
    //   customer: req.body.customer,
    //   components: {
    //     payment_element: {
    //       enabled: true,
    //       features: {
    //         payment_method_redisplay: "enabled",
    //         payment_method_save: "enabled",
    //         payment_method_save_usage: "on_session",
    //         payment_method_remove: "enabled",
    //       }
    //     }
    //   }
    // })
    // const session = await stripe.checkout.sessions.create({
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: currency,
    //         product_data: {
    //           name: 'Test Product',
    //         },
    //         unit_amount: parseInt(amount) * 100,
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'payment',
    //   success_url: 'https://example.com/success',
    //   cancel_url: 'https://example.com/cancel',

    // })
    
    return res.json({
      clientSecret: paymentIntents.client_secret,
      // customer_session_client_secret: customerSession.client_secret
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