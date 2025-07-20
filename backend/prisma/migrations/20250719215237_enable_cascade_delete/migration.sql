-- DropForeignKey
ALTER TABLE "OwnershipToken" DROP CONSTRAINT "OwnershipToken_assetId_fkey";

-- AddForeignKey
ALTER TABLE "OwnershipToken" ADD CONSTRAINT "OwnershipToken_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
