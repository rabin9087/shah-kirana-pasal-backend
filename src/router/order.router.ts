import { Router } from "express";
import { createNewOrder, getAOrderByFilterController, getOrders, getOrdersByDateController, updateAOrderController, updateMultipleOrderController } from "../controller/order.controller";
import { PickerAccess, adminAccess, auth } from "../middleware/auth";

const router = Router();

router.post("/new-order", createNewOrder);
router.get("/orderNumber=:orderNumber", getAOrderByFilterController);
router.get("/all-orders",adminAccess, getOrders);
router.get("/date=:date",PickerAccess, getOrdersByDateController);
router.patch("/update/:_id",PickerAccess, updateAOrderController );
router.patch("/updateMultiple",PickerAccess, updateMultipleOrderController );
router.delete("/:_id");
router.put("/");
export default router;