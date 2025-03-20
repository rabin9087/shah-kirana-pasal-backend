import { Router } from "express";
import { createNewProduct, deleteProductByID, fetchAProductByFilter, fetchAProductByID, fetchAProductByQRCode, fetchAProductBySKUController, getAllProductList, getAllProductListByCategory, getAllProductListByLimit, updateAProductController, updateAProductStatusController, updateProductThumbnail } from "../controller/product.controller";
import { upload } from "../utils/awsUpload";
import { getAllActiveProducts } from "../model/product/product.model";
import { PickerAccess, adminAccess } from "../middleware/auth";

const router = Router();


// Multer middleware for handling uploads
const uploadMiddleware = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "thumbnail", maxCount: 1 },
]);

const updateUploadMiddleware = upload.fields([
  { name: "addImages", maxCount: 10 },
  { name: "newThumbnail", maxCount: 1 },
]);

const uploadMiddlewareImageThumbnail = upload.fields([
  { name: "thumbnail", maxCount: 1 },
])

router.post("/", adminAccess, uploadMiddleware, createNewProduct);
router.get("/limitProduct", getAllProductListByLimit);
router.get("/sku_value/:sku", adminAccess, fetchAProductBySKUController);
router.patch("/thumbnail/:_id", adminAccess, uploadMiddlewareImageThumbnail, updateProductThumbnail);
router.get("/q", fetchAProductByFilter);
router.get("/q=:code", fetchAProductByQRCode);
router.get("/:_id", fetchAProductByID);
router.get("/category/:slug", getAllProductListByCategory);
router.get("/", getAllProductList);
router.get("/", getAllActiveProducts);
router.delete("/:_id", adminAccess, deleteProductByID);
router.put("/:_id", updateUploadMiddleware, updateAProductController);
router.patch("/:_id", PickerAccess, updateAProductStatusController);
export default router;