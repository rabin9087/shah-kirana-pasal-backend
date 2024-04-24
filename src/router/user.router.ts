import { Router } from "express";
import { createNewUser } from "../controller/user.controller";
const router = Router();

router.post("/sign-up", createNewUser);
router.post("/login");
router.get("/");
router.delete("/:_id");
router.put("/");
export default router;
