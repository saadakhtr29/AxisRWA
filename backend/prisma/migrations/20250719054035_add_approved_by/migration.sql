-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "approvedBy" TEXT;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
