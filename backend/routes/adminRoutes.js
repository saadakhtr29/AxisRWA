const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

// Asset approval
router.get(
  "/assets/pending",
  verifyToken,
  requireRole(["admin"]),
  adminController.getPendingAssets
);
router.put(
  "/assets/:assetId/approve",
  verifyToken,
  requireRole(["admin"]),
  adminController.approveAsset
);
router.put(
  "/assets/:assetId/reject",
  verifyToken,
  requireRole(["admin"]),
  adminController.rejectAsset
);

// Platform stats
router.get(
  "/stats",
  verifyToken,
  requireRole(["admin"]),
  adminController.getPlatformStats
);

// Role management
router.put(
  "/user/:userId/role",
  verifyToken,
  requireRole(["admin"]),
  adminController.updateUserRole
);
router.put(
  "/user/:userId/ban",
  verifyToken,
  requireRole(["admin"]),
  adminController.banUser
);

// ROI verification
router.get(
  "/roi/distributions",
  verifyToken,
  requireRole(["admin"]),
  adminController.viewROIDistributions
);

module.exports = router;
