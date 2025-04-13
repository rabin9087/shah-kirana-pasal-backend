import { Router } from "express";
import { createNewJobController, getAllJobsController, upadateAJobController, upadateJobPaymentController } from "../controller/jobs.controller";

const router = Router();

router.get("/:_id", getAllJobsController)
router.post("/", createNewJobController)
router.patch("/:_id", upadateJobPaymentController)
router.put("/:_id", upadateAJobController)

export default router;