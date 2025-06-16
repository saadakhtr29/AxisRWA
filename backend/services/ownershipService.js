const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createOwnershipRecord = async (userId, assetId, quantity, txHash) => {
  return prisma.ownershipToken.create({
    data: { userId, assetId, quantity, txHash },
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

const getByTxHash = async (txHash) => {
  return prisma.ownershipToken.findUnique({
    where: { txHash },
  });
};

const getOwnershipById = async (id) => {
  return prisma.ownershipToken.findUnique({
    where: { id },
    include: { user: true, asset: true },
  });
};

const deleteOwnership = async (id) => {
  try {
    return await prisma.ownershipToken.delete({
      where: { id },
    });
  } catch {
    return null;
  }
};

module.exports = {
  createOwnershipRecord,
  getOwnershipByUser,
  getOwnershipByAsset,
  getByTxHash,
  getOwnershipById,
  deleteOwnership,
};
