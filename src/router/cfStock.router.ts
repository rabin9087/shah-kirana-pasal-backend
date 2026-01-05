import { Router } from "express";
import { UpdateStockByIdentifierController, createCfStockController, getStockByIdentifierController, getStockByLocationController, getStockBySKUController, uploadBulkStockController } from "../controller/cfStock.controller";

const router = Router();

router.post("/", createCfStockController)
router.post("/bulkStock", uploadBulkStockController)
router.get("/sku/:sku", getStockBySKUController)
router.get("/location/:location", getStockByLocationController)
router.get("/identifier/:identifier", getStockByIdentifierController)
router.patch("/identifier/:identifier", UpdateStockByIdentifierController)
router.patch("/:_id",)

export default router;