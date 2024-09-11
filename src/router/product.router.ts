import { Router } from "express";
import { createNewProduct, deleteProductByID, fetchAProductByFilter, fetchAProductByID, fetchAProductByQRCode, getAllProductList, getAllProductListByCategory, updateAProductController, updateAProductStatusController } from "../controller/product.controller";
import { upload, uploatImageS3 } from "../utils/awsUpload";
import multer from 'multer'

const router = Router();


// Multer middleware for handling uploads
const uploadMiddleware = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "thumbnail", maxCount: 1 },
]);

const updatUploadMiddleware = upload.fields([
  { name: "addImages", maxCount: 10 },
  { name: "newThumbnail", maxCount: 1 },
]);


router.post("/", uploadMiddleware, createNewProduct);
router.get("/q", fetchAProductByFilter);
router.get("/q=:code", fetchAProductByQRCode);
router.get("/:_id", fetchAProductByID);
router.get("/category/:slug", getAllProductListByCategory);
router.get("/", getAllProductList);
router.delete("/:_id", deleteProductByID);
router.put("/:_id", updatUploadMiddleware, updateAProductController);
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