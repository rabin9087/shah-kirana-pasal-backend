"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const auth_1 = require("../middleware/auth");
const awsUpload_1 = require("../utils/awsUpload");
const router = (0, express_1.Router)();
const updateUploadMiddleware = awsUpload_1.upload.fields([
    { name: "profile", maxCount: 1 },
]);
router.post("/sign-up", user_controller_1.createNewUser);
router.patch("/profile", auth_1.auth, updateUploadMiddleware, user_controller_1.updateUserProfile);
router.patch("/cart", auth_1.auth, user_controller_1.updateUserCartController);
router.patch("/cartHistory", auth_1.auth, user_controller_1.updateUserCartHistoryController);
router.post("/sign-up/admin", auth_1.newAdminSignUpAuth, user_controller_1.createNewUser);
router.post("/login", user_controller_1.loginUser);
router.get("/logout", user_controller_1.signOutUser);
router.get("/userDetails/:phone", auth_1.adminAccess, user_controller_1.getAUserByPhoneController);
router.get("/get-accessjwt", auth_1.refreshAuth);
router.post("/forget-password", user_controller_1.OTPRequest);
router.post("/otp-verify", user_controller_1.OTPVerification);
router.post("/new-password", user_controller_1.updatePassword);
router.get("/", auth_1.auth, user_controller_1.getUserController);
router.get("/all", auth_1.adminAccess, user_controller_1.getAllUsersController);
router.delete("/:_id");
router.put("/:phone", auth_1.auth, user_controller_1.updateAUserProfile);
router.post("/send-registeration-link", auth_1.adminAccess, user_controller_1.sendLinkController);
exports.default = router;
