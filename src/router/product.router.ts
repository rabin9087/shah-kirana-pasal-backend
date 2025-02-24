import { Router } from "express";
import { createNewProduct, deleteProductByID, fetchAProductByFilter, fetchAProductByID, fetchAProductByQRCode, fetchAProductBySKUController, getAllProductList, getAllProductListByCategory, updateAProductController, updateAProductStatusController } from "../controller/product.controller";
import { upload } from "../utils/awsUpload";
import multer from 'multer'
import { getAllActiveProducts } from "../model/product/product.model";
import { adminAccess } from "../middleware/auth";

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


router.post("/", uploadMiddleware, createNewProduct);
router.get("/sku_value/:sku", adminAccess, fetchAProductBySKUController);
router.get("/q", fetchAProductByFilter);
router.get("/q=:code", fetchAProductByQRCode);
router.get("/:_id", fetchAProductByID);
router.get("/category/:slug", getAllProductListByCategory);
router.get("/", getAllProductList);
router.get("/", getAllActiveProducts);
router.delete("/:_id", deleteProductByID);
router.put("/:_id", updateUploadMiddleware, updateAProductController);
router.patch("/:_id", updateAProductStatusController);
// router.put("/:_id", updatUploadMiddleware,async(req, res, next) => {
//   try {
//     console.log(req.file)
//     console.log(req.files)
//     console.log("Images:" ,JSON.parse(req.body.images))
//     res.json({})
//   } catch (error) {
//     next(error)
//   }
// })
export default router;