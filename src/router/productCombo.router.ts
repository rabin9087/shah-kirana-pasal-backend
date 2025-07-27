import { Router } from "express";
import { createProductComboOfferController, getAProductComboOfferController, getAllProductComboOfferController } from "../controller/productComboOffer.controller";
import { adminAccess } from "../middleware/auth";

const router = Router();

// Placeholder for future product combo offer routes
router.post("/", adminAccess, createProductComboOfferController)
router.get("/comboOffer", getAllProductComboOfferController)
router.get("/:_id", getAProductComboOfferController)
router.patch("/:_id", getAProductComboOfferController)

export default router;