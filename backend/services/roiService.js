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

// FIXED: Use double-quoted identifiers for case-sensitive PostgreSQL column names
const getUserRoiHistory = async (userId) => {
  return prisma.$queryRaw`
    SELECT 
      "assetId" as "assetId",
      DATE_TRUNC('month', "distributedAt") as "month",
      SUM("amount")::FLOAT as "totalAmount"
    FROM "RoiToken"
    WHERE "userId" = ${userId}
    GROUP BY "assetId", month
    ORDER BY month DESC;
  `;
};

// OR — If prefer Prisma Query Builder instead of raw SQL
const getUserRoiHistoryWithPrisma = async (userId) => {
  const all = await prisma.roiToken.findMany({
    where: { userId },
    select: {
      assetId: true,
      distributedAt: true,
      amount: true,
    },
  });

  // Manual monthly aggregation in JS
  const map = new Map();
  for (const roi of all) {
    const month = roi.distributedAt.toISOString().slice(0, 7); // e.g. "2025-06"
    const key = `${roi.assetId}-${month}`;
    const current = map.get(key) || {
      assetId: roi.assetId,
      month,
      totalAmount: 0,
    };
    current.totalAmount += roi.amount;
    map.set(key, current);
  }

  return Array.from(map.values()).sort((a, b) =>
    b.month.localeCompare(a.month)
  );
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
  getUserRoiHistoryWithPrisma, // optional alternate method
};
