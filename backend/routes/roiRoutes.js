const express = require("express");
const router = express.Router();
const roiController = require("../controllers/roiController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

// Authenticated user routes
router.get("/my-tokens", authMiddleware, roiController.getMyRoiTokens);
router.get("/my-history", authMiddleware, roiController.getMyRoiHistory);
router.get("/asset/:assetId", authMiddleware, roiController.getRoiForAsset);

// Admin-only: manual ROI distribution
router.post(
  "/admin/distribute",
  authMiddleware,
  roleMiddleware(["admin"]),
  roiController.triggerRoiDistribution
);

module.exports = router;
