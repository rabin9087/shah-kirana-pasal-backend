import { Router } from "express";
import { getAllSalesController, getSaleAmountController } from "../controller/sales.controller";

const router = Router();

router.get("/", getSaleAmountController)
router.get("/all", getAllSalesController)

export default router;