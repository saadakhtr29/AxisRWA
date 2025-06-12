const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createOwnershipRecord = async (userId, assetId, quantity, txHash) => {
  return prisma.ownershipToken.create({
    data: {
      userId,
      assetId,
      quantity,
      txHash,
    },
  });
};

const getOwnershipByUser = async (userId) => {
  return prisma.ownershipToken.findMany({
    where: { userId },
    include: { asset: true },
  });
};

const getOwnershipByAsset = async (assetId) => {
  return prisma.ownershipToken.findMany({
    where: { assetId },
    include: { user: true },
  });
};

// 🔍 For checking duplicate txHash
const getByTxHash = async (txHash) => {
  return prisma.ownershipToken.findUnique({
    where: { txHash },
  });
};

module.exports = {
  createOwnershipRecord,
  getOwnershipByUser,
  getOwnershipByAsset,
  getByTxHash,
};
