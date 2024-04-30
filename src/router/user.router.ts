import { Router } from "express";
import {
  createNewUser,
  loginUser,
  getUser,
  sendLinkController,
} from "../controller/user.controller";
import { adminAccess, auth, newAdminSignUpAuth } from "../middleware/auth";
const router = Router();

router.post("/sign-up", createNewUser);
router.post("/sign-up/admin", newAdminSignUpAuth, createNewUser);
router.post("/login", loginUser);
router.get("/", auth, getUser);
router.delete("/:_id");
router.put("/");
router.post("/send-registeration-link", adminAccess, sendLinkController);
export default router;