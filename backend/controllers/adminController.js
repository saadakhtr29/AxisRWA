const adminService = require("../services/adminService");

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
  await adminService.updateUserRole(userId, role);
  res.json({ message: `User role updated to ${role}` });
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
