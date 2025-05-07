import { Router } from "express";
import { createNewDueController, getUserDueController, updateUserDueController } from "../controller/due.controller";
import { storeSalerAccess } from "../middleware/auth";

const router = Router();

router.post("/", storeSalerAccess, createNewDueController)
router.get("/:userId", storeSalerAccess, getUserDueController)
router.patch("/:_id", storeSalerAccess,  updateUserDueController)

export default router;