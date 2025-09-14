// routes/issue.routes.js
import { Router } from "express";
import {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  addIssueUpdate,
  updateIssue
} from "../controllers/issue.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Citizen creates issue (with optional image)
router.post(
  "/",
  protect(["USER"]),
  upload.single("image"),
  createIssue
);

// Get all issues (SuperAdmin & Dept can view)
router.get(
  "/",
  getAllIssues
);

// Get single issue by ID
router.get(
  "/:id",
  getIssueById
);

// Update issue status (Dept or Admin)
router.patch(
  "/:id/status",
  protect(["DEPARTMENT", "ADMIN"]),
  updateIssueStatus
);

// Add progress/update message for issue
router.post(
  "/:id/updates",
  protect(["DEPARTMENT", "ADMIN"]),
  addIssueUpdate
);

router.patch(
  "/:id",
  protect(["DEPARTMENT", "ADMIN"]),
  updateIssue
);


export default router;
