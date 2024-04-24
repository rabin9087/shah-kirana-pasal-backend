import { Router } from "express";
import { createNewUser, loginUser } from "../controller/user.controller";
import { auth } from "../middleware/auth";
const router = Router();

router.post("/sign-up", createNewUser);
router.post("/login", loginUser);
router.get("/", auth);
router.delete("/:_id");
router.put("/");
export default router;
