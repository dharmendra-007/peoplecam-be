// controllers/issue.controller.js
import { prisma } from "../../prisma/client.js";
import { uploadFile } from "../utils/s3.js";
import { APIError } from "../middlewares/error.middleware.js";

// ✅ Create Issue
export const createIssue = async (req, res, next) => {
  try {
    const { title, description, tags, priority, departmentId, lat, lng } = req.body; // Changed 'long' to 'lng'
    const userId = req.user.id;

    if (!title || !description || !priority || !departmentId || !lat || !lng) { // Changed 'long' to 'lng'
      throw new APIError("Title, description, priority, lat, lng and department are required", 400); // Updated error message
    }

    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        tags: tags ? tags.split(",") : [],
        priority,
        raisedById: userId, // ✅ This should work with your schema
        departmentId,       // ✅ This should work with your schema
        lat,
        lng,                // ✅ Changed from 'long' to 'lng'
        images: req.file
          ? {
              create: {
                imageUrl: await uploadFile(req.file, "issues"),
                format: req.file.mimetype === 'image/jpeg' ? 'JPEG' : 
                        req.file.mimetype === 'image/png' ? 'PNG' : 
                        req.file.mimetype === 'image/webp' ? 'WEBP' : 'JPEG', // Infer format from mimetype
                fileSizeKB: Math.round(req.file.size / 1024),
              },
            }
          : undefined,
      },
      include: {
        raisedBy: { select: { id: true, name: true, email: true } },
        department: { select: { id: true, name: true } },
        images: true,
      },
    });

    res.status(201).json({
      status: "Success",
      message: "Issue created successfully",
      data: issue,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Get all Issues
export const getAllIssues = async (req, res, next) => {
  try {
    const issues = await prisma.issue.findMany({
      include: {
        raisedBy: { select: { id: true, name: true, email: true } },
        department: { select: { id: true, name: true } },
        images : {select : {imageUrl : true}}
      },
    });

    res.status(200).json({
      status: "Success",
      results: issues.length,
      data: issues,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Get single Issue by ID
export const getIssueById = async (req, res, next) => {
  try {
    const issue = await prisma.issue.findUnique({
      where: { id: req.params.id },
      include: {
        raisedBy: { select: { id: true, name: true, email: true } },
        department: { select: { id: true, name: true } },
        updates: { include: { updatedBy: { select: { id: true, name: true } } } },
      },
    });

    if (!issue) throw new APIError("Issue not found", 404);

    res.status(200).json({ status: "Success", data: issue });
  } catch (err) {
    next(err);
  }
};

// ✅ Update Issue Status
export const updateIssueStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) throw new APIError("Status is required", 400);

    const issue = await prisma.issue.update({
      where: { id: req.params.id },
      data: {
        status
      },
    });

    res.status(200).json({
      status: "Success",
      message: "Issue status updated successfully",
      data: issue,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Add Progress Update
export const addIssueUpdate = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) throw new APIError("Update message is required", 400);

    let data = { message, issueId: req.params.id };

    if (req.user.role === "DEPARTMENT") data.updatedByDeptId = req.user.id;
    else if (req.user.role === "ADMIN") data.updatedByAdminId = req.user.id;
    else return next(new APIError("Unauthorized role", 403));

    const update = await prisma.issueUpdate.create({ data });

    res.status(200).json({
      status: "Success",
      message: "Update added successfully",
      data: update,
    });
  } catch (err) {
    next(err);
  }
};

// controllers/issue.controller.js
// ✅ Update Issue (general update)
export const updateIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const issue = await prisma.issue.update({
      where: { id },
      data: updates,
      include: {
        raisedBy: { select: { id: true, name: true, email: true } },
        department: { select: { id: true, name: true } },
        images: true,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "Issue updated successfully",
      data: issue,
    });
  } catch (err) {
    next(err);
  }
};
