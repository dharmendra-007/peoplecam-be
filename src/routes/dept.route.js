import { Router } from "express";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDepartmentStats
} from "../controllers/dept.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", protect(["ADMIN"]), createDepartment);
router.get("/", protect(["ADMIN" , "DEPARTMENT" , "USER"]), getDepartments);
router.get("/:id", protect(["ADMIN", "DEPARTMENT"]), getDepartmentById);
router.put("/:id", protect(["ADMIN" , "DEPARTMENT"]), updateDepartment);
router.delete("/:id", protect(["ADMIN"]), deleteDepartment);
router.get("/:id/stats", protect(["ADMIN" ,"DEPARTMENT"]), getDepartmentStats);

export default router;