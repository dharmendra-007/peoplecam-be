import { prisma } from "../../prisma/client.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import { APIError } from "../middlewares/error.middleware.js";

export const signupUser = async (data) => {
  const { name, email, phoneNo, password } = data;
  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, phoneNo, password: hashed, role: "USER" },
  });

  const token = generateToken({ id: user.id, role: "USER" });
  return { user, token };
};

export const signupDepartment = async (data, adminId) => {
  // only superadmin allowed (already checked in middleware)
  const { name, email, password, maxFund } = data;
  const hashed = await hashPassword(password);

  const dept = await prisma.department.create({
    data: { name, email, password: hashed, maxFund, availableFund: maxFund },
  });

  return dept;
};

export const signupAdmin = async (data) => {
  const { name, email, password } = data;
  const hashed = await hashPassword(password);

  const admin = await prisma.superAdmin.create({
    data: { name, email, password: hashed },
  });

  const token = generateToken({ id: admin.id, role: "ADMIN" });
  return { admin, token };
};

export const login = async (data, type) => {
  const { email, password } = data;

  let user;
  if (type === "USER") {
    user = await prisma.user.findUnique({ where: { email } });
  } else if (type === "DEPARTMENT") {
    user = await prisma.department.findUnique({ where: { email } });
  } else if (type === "ADMIN") {
    user = await prisma.superAdmin.findUnique({ where: { email } });
  }

  if (!user) throw new APIError("Invalid credentials", 401);

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new APIError("Invalid credentials", 401);

  const token = generateToken({ id: user.id, role: type });
  return { user, token };
};
