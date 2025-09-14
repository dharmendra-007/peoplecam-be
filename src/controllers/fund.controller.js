// controllers/fund.controller.js
import { prisma } from "../../prisma/client.js";
import { APIError } from "../middlewares/error.middleware.js";
import { uploadFile } from "../utils/s3.js";

export const addFundUpdate = async (req, res, next) => {
  try {
    const { departmentId, message, spend, source, issueId, amount } = req.body;

    // Validate department
    const dept = await prisma.department.findUnique({ where: { id: departmentId } });
    if (!dept) throw new APIError("Department not found", 404);

    // ✅ Create FundUpdate entry first
    const fundUpdate = await prisma.fundUpdate.create({
      data: {
        departmentId,
        message,
        spend: spend === "true",
        source,
        issueId: issueId || null,
      },
    });

    // ✅ Handle invoice (if uploaded)
    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        throw new APIError("Only PDF files are allowed for invoices", 400);
      }

      const invoiceUrl = await uploadFile(req.file, "invoices");

      await prisma.fundInvoice.create({
        data: {
          fundUpdateId: fundUpdate.id,
          invoiceUrl,
          format: "PDF",
          fileSizeKB: Math.round(req.file.size / 1024), // store KB
        },
      });
    }

    // ✅ Update department funds
    const parsedAmount = parseFloat(amount || 0);
    const newAvailableFund =
      spend === "true"
        ? dept.availableFund - parsedAmount
        : dept.availableFund + parsedAmount;

    await prisma.department.update({
      where: { id: departmentId },
      data: { availableFund: newAvailableFund },
    });

    res.status(201).json({ fundUpdate });
  } catch (err) {
    next(err);
  }
};
