import { Router } from "express";
import { createNewShopController, getAllShopController } from "../controller/shop.controller";
import { upload } from "../utils/awsUpload";
import { adminAccess } from "../middleware/auth";

const router = Router();
const uploadMiddlewareLogo = upload.fields([
  { name: "logo", maxCount: 1 },
])

router.post("/", uploadMiddlewareLogo, createNewShopController)
router.get("/", getAllShopController)
// router.post(`=?}`, );

export default router;