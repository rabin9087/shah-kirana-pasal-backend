import { Router } from "express";
import { searchProductItem, searchUser } from "../controller/search.controller";

const router = Router();

router.get("/products", searchProductItem)
router.get("/user", searchUser)
// router.post(`=?}`, );

export default router;