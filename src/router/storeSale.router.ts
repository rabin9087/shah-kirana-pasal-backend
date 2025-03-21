import { Router } from "express";
import { getAllSalesController, getSaleAmountController } from "../controller/sales.controller";
import { adminAccess, storeSalerAccess } from "../middleware/auth";
import { createNewStoreSaleOrder } from "../controller/storeSale.controller";

const router = Router();

router.post("/new-storeSale", storeSalerAccess, createNewStoreSaleOrder);
router.get("/", adminAccess, getSaleAmountController)
router.get("/allSales", adminAccess, getAllSalesController)

export default router;