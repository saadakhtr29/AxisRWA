const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

// Asset approval
router.get(
  "/assets/pending",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminController.getPendingAssets
);
router.put(
  "/assets/:assetId/approve",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminController.approveAsset
);
router.put(
  "/assets/:assetId/reject",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminController.rejectAsset
);

// Platform stats
router.get(
  "/stats",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminController.getPlatformStats
);

// Role management
router.put(
  "/user/:userId/role",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminController.updateUserRole
);
router.put(
  "/user/:userId/ban",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminController.banUser
);
router.get(
  "/users",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminController.getAllUsers
);

// ROI verification
router.get(
  "/roi/distributions",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminController.viewROIDistributions
);

// KYC verification
router.put(
  "/kyc/:kycId/review",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminController.reviewKYC
);

module.exports = router;
