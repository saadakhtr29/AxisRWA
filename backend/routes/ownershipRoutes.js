const express = require("express");
const router = express.Router();
const ownershipController = require("../controllers/ownershipController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { body } = require("express-validator");

// Purchase Ownership Token
router.post(
  "/purchase",
  authMiddleware,
  [
    body("assetId").isUUID().withMessage("Invalid asset ID"),
    body("quantity")
      .isInt({ gt: 0 })
      .withMessage("Quantity must be a positive integer"),
    body("txHash")
      .isString()
      .isLength({ min: 66, max: 66 })
      .withMessage("Invalid transaction hash format"),
  ],
  ownershipController.purchaseOwnership
);

// View current user's investments
router.get(
  "/my-investments",
  authMiddleware,
  ownershipController.getMyInvestments
);

// View all investors for an asset
router.get(
  "/asset/:assetId",
  authMiddleware,
  ownershipController.getInvestorsByAsset
);

// View a specific ownership record by ID
router.get("/:id", authMiddleware, ownershipController.getOwnershipById);

// Revoke an ownership (admin only)
router.delete("/:id", authMiddleware, ownershipController.revokeOwnership);

module.exports = router;
