import { Router } from "express";
import { createDepartment, getDepartments } from "../controllers/dept.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", protect(["ADMIN"]), createDepartment);
router.get("/", protect(["ADMIN"]), getDepartments);

export default router;
