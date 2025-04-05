import { Router } from "express";
import { getAllSalesController, getSaleAmountController } from "../controller/sales.controller";
import { adminAccess, storeSalerAccess, superAdminAccess } from "../middleware/auth";
import { createNewStoreSaleOrder, getDailySalesController } from "../controller/storeSale.controller";

const router = Router();

router.post("/new-storeSale", storeSalerAccess, createNewStoreSaleOrder);
router.get("/", adminAccess, getSaleAmountController)
router.get("/allStoreSales", superAdminAccess, getAllSalesController)
router.get("/dailyStoreSales", storeSalerAccess, getDailySalesController)

export default router;