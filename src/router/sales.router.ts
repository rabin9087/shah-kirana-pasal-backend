import { Router } from "express";
import { getAllOrderSalesController, getSaleAmountController } from "../controller/sales.controller";
import { adminAccess } from "../middleware/auth";

const router = Router();

router.get("/", adminAccess, getSaleAmountController)
router.get("/allSales", adminAccess, getAllOrderSalesController)

export default router;