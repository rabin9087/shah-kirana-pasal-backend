import { Router } from "express";
import { getAllSalesController, getSaleAmountController } from "../controller/sales.controller";
import { adminAccess } from "../middleware/auth";

const router = Router();

router.get("/", adminAccess, getSaleAmountController)
router.get("/allSales", adminAccess, getAllSalesController)

export default router;