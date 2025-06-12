const express = require("express");
const {
  createAsset,
  getAllAssets,
  getAssetById,
  getPartnerAssets,
  approveAsset,
  updateAsset,
  deleteAsset,
} = require("../controllers/assetController");

const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getAllAssets);
router.get("/:id", getAssetById);

// Partner-only
router.post("/", authMiddleware, roleMiddleware(["partner"]), createAsset);
router.get(
  "/partner/all",
  authMiddleware,
  roleMiddleware(["partner"]),
  getPartnerAssets
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["partner", "admin"]),
  updateAsset
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["partner", "admin"]),
  deleteAsset
);

// Admin-only
router.put(
  "/approve/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  approveAsset
);

module.exports = router;
