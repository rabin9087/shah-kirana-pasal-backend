import { Router } from "express";
import { createNewOrder, getOrders } from "../controller/order.controller";

const router = Router();

router.post("/new-order", createNewOrder);
router.get("/:_id");
router.get("/", getOrders);
router.delete("/:_id");
router.put("/");
export default router;