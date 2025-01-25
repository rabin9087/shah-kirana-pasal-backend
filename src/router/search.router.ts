import { Router } from "express";
import { searchNewItem } from "../controller/search.controller";

const router = Router();

router.get("/products", searchNewItem)
// router.post(`=?}`, );

export default router;