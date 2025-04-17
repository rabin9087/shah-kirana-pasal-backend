import { Router } from "express";
import { createNewJobCategoryController, getAllJobsCategoryController } from "../controller/jobCategory.controller";

const router = Router();

router.get("/:_id", getAllJobsCategoryController)
router.post("/", createNewJobCategoryController)

export default router;