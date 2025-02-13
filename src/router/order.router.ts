import { Router } from "express";
import { createNewOrder, getOrders, getOrdersByDateController, updateAOrderController } from "../controller/order.controller";
import { adminAccess, auth } from "../middleware/auth";

const router = Router();

router.post("/new-order", createNewOrder);
router.get("/:_id");
router.get("/all-orders",adminAccess, getOrders);
router.get("/orders/:date",adminAccess, getOrdersByDateController);
router.patch("/update/:_id",adminAccess, updateAOrderController);
router.delete("/:_id");
router.put("/");
export default router;