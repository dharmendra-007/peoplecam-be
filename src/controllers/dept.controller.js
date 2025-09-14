// controllers/dept.controller.js
import { prisma } from "../../prisma/client.js"
import { APIError } from "../middlewares/error.middleware.js";
import { hashPassword } from "../utils/bcrypt.js";

// Only superadmin can create departments
export const createDepartment = async (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      throw new APIError("Only superadmin can create departments", 403);
    }

    const { name, email, password, maxFund } = req.body;

    const existing = await prisma.department.findUnique({ where: { email } });
    if (existing) throw new APIError("Department already exists", 400);

    const hashed = await hashPassword(password);

    const dept = await prisma.department.create({
      data: {
        name,
        email,
        password: hashed,
        maxFund: maxFund || 0,
        availableFund: maxFund || 0,
      },
    });

    res.status(201).json({ 
      status: "Success",
      message: "Department created successfully",
      data: dept 
    });
  } catch (err) {
    next(err);
  }
};

// Get all departments
export const getDepartments = async (req, res, next) => {
  try {
    const depts = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        maxFund: true,
        availableFund: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            issues: true,
            fundUpdates: true
          }
        }
      }
    });
    
    res.status(200).json({ 
      status: "Success",
      results: depts.length,
      data: depts 
    });
  } catch (err) {
    next(err);
  }
};

// Get department by ID
export const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const dept = await prisma.department.findUnique({
      where: { id },
      include: {
        issues: {
          include: {
            raisedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            images: {
              select: {
                imageUrl: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        fundUpdates: {
          include: {
            issue: {
              select: {
                id: true,
                title: true
              }
            },
            invoices: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            issues: true,
            fundUpdates: true
          }
        }
      }
    });

    if (!dept) {
      throw new APIError("Department not found", 404);
    }

    res.status(200).json({ 
      status: "Success",
      data: dept 
    });
  } catch (err) {
    next(err);
  }
};

// Update department
export const updateDepartment = async (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      throw new APIError("Only superadmin can update departments", 403);
    }

    const { id } = req.params;
    const { name, email, maxFund, availableFund } = req.body;

    // Check if department exists
    const existingDept = await prisma.department.findUnique({ where: { id } });
    if (!existingDept) {
      throw new APIError("Department not found", 404);
    }

    // Check if email is already taken by another department
    if (email && email !== existingDept.email) {
      const emailExists = await prisma.department.findUnique({ where: { email } });
      if (emailExists) {
        throw new APIError("Email already taken by another department", 400);
      }
    }

    const updatedDept = await prisma.department.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(maxFund !== undefined && { maxFund }),
        ...(availableFund !== undefined && { availableFund }),
      },
    });

    res.status(200).json({ 
      status: "Success",
      message: "Department updated successfully",
      data: updatedDept 
    });
  } catch (err) {
    next(err);
  }
};

// Delete department
export const deleteDepartment = async (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      throw new APIError("Only superadmin can delete departments", 403);
    }

    const { id } = req.params;

    // Check if department exists
    const existingDept = await prisma.department.findUnique({ where: { id } });
    if (!existingDept) {
      throw new APIError("Department not found", 404);
    }

    await prisma.department.delete({
      where: { id }
    });

    res.status(200).json({ 
      status: "Success",
      message: "Department deleted successfully" 
    });
  } catch (err) {
    next(err);
  }
};

// Get department statistics
export const getDepartmentStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dept = await prisma.department.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        maxFund: true,
        availableFund: true,
        _count: {
          select: {
            issues: true
          }
        }
      }
    });

    if (!dept) {
      throw new APIError("Department not found", 404);
    }

    // Get issue counts by status
    const issueStats = await prisma.issue.groupBy({
      by: ['status'],
      where: { departmentId: id },
      _count: true
    });

    // Get total fund spent
    const totalSpent = await prisma.fundUpdate.aggregate({
      where: {
        departmentId: id,
        spend: true
      },
      _sum: {
        amount: true
      }
    });

    const stats = {
      ...dept,
      issueStats,
      totalSpent: totalSpent._sum.amount || 0
    };

    res.status(200).json({ 
      status: "Success",
      data: stats 
    });
  } catch (err) {
    next(err);
  }
};