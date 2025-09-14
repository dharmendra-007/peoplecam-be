import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../../prisma/client.js";

export const protect = (roles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ status: "Error", message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);

      let user;
      if (decoded.role === "USER") {
        user = await prisma.user.findUnique({ where: { id: decoded.id } });
      } else if (decoded.role === "DEPARTMENT") {
        user = await prisma.department.findUnique({ where: { id: decoded.id } });
      } else if (decoded.role === "ADMIN") {
        user = await prisma.superAdmin.findUnique({ where: { id: decoded.id } });
      }

      if (!user) {
        return res.status(401).json({ status: "Error", message: "Invalid token" });
      }

      req.user = { ...decoded };
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ status: "Error", message: "Forbidden" });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
