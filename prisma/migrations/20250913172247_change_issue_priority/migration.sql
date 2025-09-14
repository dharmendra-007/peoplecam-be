/*
  Warnings:

  - The values [HIGH] on the enum `IssuePriority` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `imageUrl` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `updatedByAdminId` on the `Issue` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ImageFormat" AS ENUM ('PNG', 'JPEG', 'WEBP');

-- CreateEnum
CREATE TYPE "public"."InvoiceFormat" AS ENUM ('PDF');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."IssuePriority_new" AS ENUM ('LOW', 'MEDIUM', 'CRITICAL');
ALTER TABLE "public"."Issue" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "public"."Issue" ALTER COLUMN "priority" TYPE "public"."IssuePriority_new" USING ("priority"::text::"public"."IssuePriority_new");
ALTER TYPE "public"."IssuePriority" RENAME TO "IssuePriority_old";
ALTER TYPE "public"."IssuePriority_new" RENAME TO "IssuePriority";
DROP TYPE "public"."IssuePriority_old";
ALTER TABLE "public"."Issue" ALTER COLUMN "priority" SET DEFAULT 'MEDIUM';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Issue" DROP CONSTRAINT "Issue_updatedByAdminId_fkey";

-- AlterTable
ALTER TABLE "public"."FundUpdate" ADD COLUMN     "issueId" TEXT;

-- AlterTable
ALTER TABLE "public"."Issue" DROP COLUMN "imageUrl",
DROP COLUMN "updatedByAdminId",
ADD COLUMN     "updatedById" TEXT;

-- CreateTable
CREATE TABLE "public"."IssueImage" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "format" "public"."ImageFormat" NOT NULL,
    "fileSizeKB" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IssueImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FundInvoice" (
    "id" TEXT NOT NULL,
    "fundUpdateId" TEXT NOT NULL,
    "invoiceUrl" TEXT NOT NULL,
    "format" "public"."InvoiceFormat" NOT NULL DEFAULT 'PDF',
    "fileSizeKB" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FundInvoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_updatedByAdminId_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."SuperAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_updatedByDeptId_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IssueImage" ADD CONSTRAINT "IssueImage_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."Issue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FundUpdate" ADD CONSTRAINT "FundUpdate_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."Issue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FundInvoice" ADD CONSTRAINT "FundInvoice_fundUpdateId_fkey" FOREIGN KEY ("fundUpdateId") REFERENCES "public"."FundUpdate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
