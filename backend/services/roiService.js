const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Core monthly ROI distribution logic
const distributeRoi = async () => {
  const assets = await prisma.asset.findMany({
    where: { approved: true },
    include: {
      ownerships: true,
    },
  });

  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`;

  const results = [];

  for (const asset of assets) {
    const revenue = await prisma.revenueReport.findFirst({
      where: {
        assetId: asset.id,
        period,
      },
    });

    if (!revenue || asset.tokenSupply === 0) continue;

    for (const ownership of asset.ownerships) {
      const userShare = ownership.quantity / asset.tokenSupply;
      const roiAmount = parseFloat(
        (userShare * revenue.revenueAmount).toFixed(2)
      );

      const roi = await prisma.roiToken.create({
        data: {
          userId: ownership.userId,
          assetId: asset.id,
          amount: roiAmount,
          distributedAt: now,
        },
      });

      results.push(roi);
    }
  }

  return results;
};

const getUserRoiTokens = async (userId) => {
  return prisma.roiToken.findMany({
    where: { userId },
    include: { asset: true },
    orderBy: { distributedAt: "desc" },
  });
};

const getUserRoiHistory = async (userId) => {
  return prisma.$queryRaw`
    SELECT 
      asset_id as "assetId",
      DATE_TRUNC('month', distributed_at) as "month",
      SUM(amount)::FLOAT as "totalAmount"
    FROM "RoiToken"
    WHERE user_id = ${userId}
    GROUP BY asset_id, month
    ORDER BY month DESC;
  `;
};

const getRoiByAsset = async (assetId) => {
  return prisma.roiToken.findMany({
    where: { assetId },
    include: { user: true },
  });
};

module.exports = {
  distributeRoi,
  getUserRoiTokens,
  getUserRoiHistory,
  getRoiByAsset,
};
