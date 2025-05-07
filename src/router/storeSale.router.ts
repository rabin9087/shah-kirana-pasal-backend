import { Router } from "express";
import { adminAccess, storeSalerAccess, superAdminAccess } from "../middleware/auth";
import { createNewStoreSaleOrder, getAllStoreSalesController, getDailyStoreSalesController } from "../controller/storeSale.controller";

const router = Router();

router.post("/new-storeSale", storeSalerAccess, createNewStoreSaleOrder);
// router.get("/", adminAccess)
router.get("/allStoreSales", superAdminAccess, getAllStoreSalesController)
router.get("/dailyStoreSales/:date", storeSalerAccess, getDailyStoreSalesController)

export default router;