import { Router } from "express";
import { getAllSalesController, getSaleAmountController } from "../controller/sales.controller";

const router = Router();

router.get("/", getSaleAmountController)
router.get("/allSales", getAllSalesController)

export default router;