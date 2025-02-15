import { Router } from "express";
import {
  createNewUser,
  loginUser,
  getUserController,
  sendLinkController,
  OTPRequest,
  OTPVerification,
  updatePassword,
  signOutUser,
  updateUserProfile,
  getAllUsersController,
  updateUserCartController,
  updateUserCartHistoryController,
  getAUserByPhoneController,
} from "../controller/user.controller";
import { adminAccess, auth, newAdminSignUpAuth, refreshAuth } from "../middleware/auth";
import { upload } from "../utils/awsUpload";
const router = Router();

const updateUploadMiddleware = upload.fields([
  { name: "profile", maxCount: 10 },
]);


router.post("/sign-up", createNewUser);
router.patch("/profile", updateUploadMiddleware, updateUserProfile);
router.patch("/cart", updateUserCartController);
router.patch("/cartHistory", updateUserCartHistoryController);
router.post("/sign-up/admin", newAdminSignUpAuth, createNewUser);
router.post("/login", loginUser);
router.get("/logout", signOutUser);
router.get("/userDetails/:phone", adminAccess, getAUserByPhoneController);
router.get("/get-accessjwt", refreshAuth)
router.post("/forget-password", OTPRequest);
router.post("/otp-verify", OTPVerification);
router.post("/new-password", updatePassword);
router.get("/", auth, getUserController);
router.get("/all", adminAccess, getAllUsersController);
router.delete("/:_id");
router.put("/");
router.post("/send-registeration-link", adminAccess, sendLinkController);
export default router;