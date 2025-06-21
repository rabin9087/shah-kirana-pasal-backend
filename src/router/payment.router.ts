import { Router } from "express";
import { createPayment, createZipCheckout } from "../controller/payment.controller";

const router = Router();

router.post("/create-payment-intent", createPayment);
router.post("/create-checkout", createZipCheckout);

export default router;