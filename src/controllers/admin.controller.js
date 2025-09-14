// controllers/admin.controller.js
import {prisma} from "../../prisma/client.js";
import { APIError } from "../middlewares/error.middleware.js";

// Analytics overview
export const getAnalytics = async (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      throw new APIError("Only superadmin can view analytics", 403);
    }

    const analytics = await prisma.analytics.findFirst({
      include: { monthlyStats: true },
    });

    if (!analytics) {
      return res.json({ message: "No analytics data yet" });
    }

    res.json({ analytics });
  } catch (err) {
    next(err);
  }
};

// Update monthly stats (e.g. cron or event triggered)
export const updateMonthlyAnalytics = async (req, res, next) => {
  try {
    if (req.user.role !== "SUPERADMIN") {
      throw new APIError("Only superadmin can update analytics", 403);
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Count issues
    const raised = await prisma.issue.count({
      where: { createdAt: { gte: new Date(year, month - 1, 1) } },
    });
    const resolved = await prisma.issue.count({
      where: {
        status: "RESOLVED",
        updatedAt: { gte: new Date(year, month - 1, 1) },
      },
    });

    let analytics = await prisma.analytics.findFirst();
    if (!analytics) {
      analytics = await prisma.analytics.create({ data: {} });
    }

    const monthly = await prisma.monthlyAnalytics.upsert({
      where: { year_month_analyticsId: { year, month, analyticsId: analytics.id } },
      update: { issuesRaised: raised, issuesResolved: resolved },
      create: { year, month, issuesRaised: raised, issuesResolved: resolved, analyticsId: analytics.id },
    });

    res.json({ monthly });
  } catch (err) {
    next(err);
  }
};
