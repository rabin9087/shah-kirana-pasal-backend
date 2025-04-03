import { Router } from "express";
import { createNewShopController } from "../controller/shop.controller";
import { upload } from "../utils/awsUpload";

const router = Router();
const uploadMiddlewareLogo = upload.fields([
  { name: "logo", maxCount: 1 },
])

router.post("/", uploadMiddlewareLogo, createNewShopController)
// router.post(`=?}`, );

export default router;