/*
  Warnings:

  - You are about to drop the column `updatedById` on the `IssueUpdate` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."IssueUpdate" DROP CONSTRAINT "IssueUpdate_updatedById_fkey";

-- AlterTable
ALTER TABLE "public"."IssueUpdate" DROP COLUMN "updatedById",
ADD COLUMN     "updatedByAdminId" TEXT,
ADD COLUMN     "updatedByDeptId" TEXT,
ADD COLUMN     "updatedByUserId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."IssueUpdate" ADD CONSTRAINT "IssueUpdate_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IssueUpdate" ADD CONSTRAINT "IssueUpdate_updatedByDeptId_fkey" FOREIGN KEY ("updatedByDeptId") REFERENCES "public"."Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IssueUpdate" ADD CONSTRAINT "IssueUpdate_updatedByAdminId_fkey" FOREIGN KEY ("updatedByAdminId") REFERENCES "public"."SuperAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
