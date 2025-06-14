import { Router } from "express";

import { createNewCategory, deleteACategory, getACategory, getCategoriesList, updateACategory, updateACategoryStatus } from "../controller/category.controller";
const router = Router();

router.post("/", createNewCategory);
router.get("/:_id", getACategory);
router.get("/", getCategoriesList);
router.delete("/:_id", deleteACategory);
router.put("/", updateACategory);
router.patch("/:_id", updateACategoryStatus);
export default router;