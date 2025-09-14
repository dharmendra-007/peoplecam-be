import { Router } from "express";
import { addFundUpdate } from "../controllers/fund.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/", protect(["DEPARTMENT"]), upload.single("invoice"), addFundUpdate);

export default router;
