import { Router } from "express";
import { createProductComboOfferController, getAProductComboOfferController, getAllProductComboOfferController } from "../controller/productComboOffer.controller";

const router = Router();

// Placeholder for future product combo offer routes
router.post("/", createProductComboOfferController)
router.get("/:_id", getAProductComboOfferController)
router.get("/", getAllProductComboOfferController)


export default router;