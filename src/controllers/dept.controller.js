// controllers/dept.controller.js
import {prisma} from "../../prisma/client.js"
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

    res.status(201).json({ department: dept });
  } catch (err) {
    next(err);
  }
};

export const getDepartments = async (req, res, next) => {
  try {
    const depts = await prisma.department.findMany();
    res.json({ departments: depts });
  } catch (err) {
    next(err);
  }
};
