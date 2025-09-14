import { Router } from "express";
import * as AuthController from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// user
router.post("/user/signup", AuthController.signupUser);
router.post("/user/login", AuthController.loginUser);

// department (only superadmin can create)
router.post("/dept/signup", protect(["ADMIN"]), AuthController.signupDept);
router.post("/dept/login", AuthController.loginDept);

// super admin
router.post("/admin/signup", AuthController.signupAdmin);
router.post("/admin/login", AuthController.loginAdmin);

export default router;