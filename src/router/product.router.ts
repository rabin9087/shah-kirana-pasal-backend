import { Router } from "express";
import { createNewProduct, deleteProductByID, fetchAProductByFilter, fetchAProductByID, fetchAProductByQRCode, getAllProductList, getAllProductListByCategory, updateAProductController, updateAProductStatusController } from "../controller/product.controller";

const router = Router();

router.post("/", createNewProduct);
router.get("/q", fetchAProductByFilter);
router.get("/q=:code", fetchAProductByQRCode);
router.get("/:_id", fetchAProductByID);
router.get("/category/:slug", getAllProductListByCategory);
router.get("/", getAllProductList);
router.delete("/:_id", deleteProductByID);
router.put("/:_id", updateAProductController);
router.patch("/:_id", updateAProductStatusController);
export default router;