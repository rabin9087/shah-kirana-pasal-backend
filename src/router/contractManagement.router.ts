import { Router } from "express";
import { createNewDueController, getUserDueController } from "../controller/due.controller";

const router = Router();

router.post("/", createNewDueController)

export default router;