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
  updateAUserProfile,
  verifyEmailController,
} from "../controller/user.controller";
import { adminAccess, auth, newAdminSignUpAuth, refreshAuth } from "../middleware/auth";
import { upload } from "../utils/awsUpload";
import { loginValidation, signupValidation, validateAuthHeader, verifyEmailValidation } from "../joiValidation/userValidation/userValidation";
import { showUserProducts } from "../zappierMiddleware/userProducts";
const router = Router();

const updateUploadMiddleware = upload.fields([
  { name: "profile", maxCount: 1 },
]);

router.post("/sign-up",signupValidation, createNewUser);
router.patch("/profile", auth, updateUploadMiddleware, updateUserProfile);
router.patch("/cart", auth, updateUserCartController);
router.patch("/cartHistory", auth, updateUserCartHistoryController);
router.patch("/verify-email", verifyEmailValidation, verifyEmailController);
router.post("/sign-up/admin", newAdminSignUpAuth, createNewUser);
router.post("/login", loginValidation, loginUser);
router.get("/logout", signOutUser);
router.get("/userDetails/:phone", adminAccess, getAUserByPhoneController);
router.get("/get-accessjwt", validateAuthHeader, refreshAuth)
router.post("/forget-password", OTPRequest);
router.post("/otp-verify", OTPVerification);
router.post("/new-password", updatePassword);
router.get("/", auth, getUserController);
router.get("/all", adminAccess, getAllUsersController);
router.delete("/:_id");
router.put("/:phone", auth, updateAUserProfile);
router.post("/send-registeration-link", adminAccess, sendLinkController);
export default router;