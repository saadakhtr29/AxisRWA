const express = require("express");
const {
  createAsset,
  getAllAssets,
  getAssetById,
  getPartnerAssets,
  approveAsset,
  updateAsset,
  deleteAsset,
  getAllSubmittedAssets,
  rejectAsset,
} = require("../controllers/assetController");

const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate limiter to avoid abuse
const assetLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 mins
  max: 100,
  message: "Too many requests, please try again later.",
});

router.use(assetLimiter); // Apply to all routes

// Public Routes
router.get("/", getAllAssets); // paginated
router.get("/:id", getAssetById); // asset detail

// Partner-only Routes
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

// Admin-only Route
router.put(
  "/approve/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  approveAsset
);

router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware(["admin"]),
  getAllSubmittedAssets
);

router.put(
  "/approve/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  approveAsset
);

router.put(
  "/reject/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  rejectAsset
);

module.exports = router;
