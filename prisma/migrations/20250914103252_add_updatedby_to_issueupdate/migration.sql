-- AlterTable
ALTER TABLE "public"."IssueUpdate" ADD COLUMN     "updatedById" TEXT;

-- AddForeignKey
ALTER TABLE "public"."IssueUpdate" ADD CONSTRAINT "IssueUpdate_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
