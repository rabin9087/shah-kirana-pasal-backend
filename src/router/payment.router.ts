import { Router } from "express";
import { createPayment } from "../controller/payment.controller";

const router = Router();

router.post("/create-payment-intent", createPayment);

export default router;