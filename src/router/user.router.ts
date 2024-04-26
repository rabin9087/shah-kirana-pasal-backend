import { Router } from "express";
import {
  createNewUser,
  loginUser,
  getUser,
  createTokenForAdmin,
  sendLinkController,
} from "../controller/user.controller";
import { adminAccess, auth } from "../middleware/auth";
const router = Router();

router.post("/sign-up", createNewUser);
router.post("/sign-up/admin", auth, createNewUser);
router.post("/login", loginUser);
router.get("/", auth, getUser);
router.delete("/:_id");
router.put("/");
router.post("/create-token/:email", adminAccess, createTokenForAdmin);
router.post("/send-registeration-link", adminAccess, sendLinkController);
export default router;
