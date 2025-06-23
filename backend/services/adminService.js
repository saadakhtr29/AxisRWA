const prisma = require("../prisma/client");
const { sendEmail } = require("../utils/emailService");

exports.getPendingAssets = async () => {
  return await prisma.asset.findMany({
    where: { status: "pending" },
    include: { partner: true },
  });
};

exports.updateAssetStatus = async (assetId, status) => {
  return await prisma.asset.update({
    where: { id: assetId },
    data: { status },
  });
};

exports.getPlatformStats = async () => {
  const [users, assets, investments, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.asset.count(),
    prisma.ownershipToken.aggregate({ _sum: { quantity: true } }),
    prisma.revenueReport.aggregate({ _sum: { revenueAmount: true } }),
  ]);

  return {
    totalUsers: users,
    totalAssets: assets,
    totalOwnershipTokensSold: investments._sum.quantity || 0,
    totalRevenueReported: revenue._sum.revenueAmount || 0,
  };
};

exports.updateUserRole = async (userId, role) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
};

exports.banUser = async (userId) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { banned: true },
  });
};

exports.getROIDistributions = async () => {
  return await prisma.roiToken.findMany({
    include: {
      user: { select: { email: true } },
      asset: { select: { title: true } },
    },
    orderBy: { distributedAt: "desc" },
  });
};

exports.reviewKYCFile = async (kycId, action) => {
  const kyc = await prisma.kYCFile.update({
    where: { id: kycId },
    data: {
      status: action,
      reviewedAt: new Date(),
    },
    include: { user: true },
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId: kyc.userId,
      title: `KYC ${action}`,
      body: `Your KYC submission has been ${action}.`,
    },
  });

  // Send email
  await sendEmail({
    to: kyc.user.email,
    subject: `KYC ${action}`,
    text: `Dear user, your KYC has been ${action}.`,
  });

  return { message: `KYC ${action}` };
};
