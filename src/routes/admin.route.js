import { Router } from "express";
import { getAnalytics, updateMonthlyAnalytics } from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/analytics", protect(["ADMIN"]), getAnalytics);
router.post("/analytics/update", protect(["ADMIN"]), updateMonthlyAnalytics);

export default router;
