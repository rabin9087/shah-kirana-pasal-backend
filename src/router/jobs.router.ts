import { Router } from "express";
import { createNewJobController } from "../controller/jobs.controller";

const router = Router();

router.post("/", createNewJobController)

export default router;