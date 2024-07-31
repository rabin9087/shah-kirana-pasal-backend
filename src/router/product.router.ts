import { Router } from "express";
import { createNewProduct, deleteProductByID, fetchAProductByFilter, fetchAProductByID, fetchAProductByQRCode, getAllProductList, updateAProductController } from "../controller/product.controller";

const router = Router();

router.post("/", createNewProduct);
router.get("/q", fetchAProductByFilter);
router.get("/q=:code", fetchAProductByQRCode);
router.get("/:_id", fetchAProductByID);
router.get("/", getAllProductList);
router.delete("/:_id", deleteProductByID);
router.put("/:_id", updateAProductController);
export default router;