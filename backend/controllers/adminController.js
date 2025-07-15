const adminService = require("../services/adminService");
const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getPendingAssets = async (req, res) => {
  const assets = await adminService.getPendingAssets();
  res.status(200).json(assets);
};

exports.approveAsset = async (req, res) => {
  const { assetId } = req.params;
  await adminService.updateAssetStatus(assetId, "approved");
  res.json({ message: "Asset approved" });
};

exports.rejectAsset = async (req, res) => {
  const { assetId } = req.params;
  await adminService.updateAssetStatus(assetId, "rejected");
  res.json({ message: "Asset rejected" });
};

exports.getPlatformStats = async (req, res) => {
  const stats = await adminService.getPlatformStats();
  res.status(200).json(stats);
};

exports.updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!Object.values(Role).includes(role)) {
    return res.status(400).json({ message: "Invalid role provided" });
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    res.status(200).json({
      message: `Role updated to ${role}`,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Role update error:", error);
    res.status(500).json({ message: "Failed to update role" });
  }
};

exports.banUser = async (req, res) => {
  const { userId } = req.params;
  await adminService.banUser(userId);
  res.json({ message: "User has been banned" });
};

exports.viewROIDistributions = async (req, res) => {
  const distributions = await adminService.getROIDistributions();
  res.status(200).json(distributions);
};

exports.reviewKYC = async (req, res) => {
  const { kycId } = req.params;
  const { action } = req.body; // "approved" | "rejected"
  const result = await adminService.reviewKYCFile(kycId, action);
  res.json(result);
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        wallet: true,
        createdAt: true,
      },
    });

    res.status(200).json({ users });
  } catch (err) {
    console.error("Failed to fetch users", err);
    res.status(500).json({ message: "Error retrieving users" });
  }
};
