const express = require("express");
const router = express.Router();
const ownershipController = require("../controllers/ownershipController");
const { verifyJWT } = require("../middleware/authMiddleware");
const { body } = require("express-validator");

// POST /api/ownership/purchase
router.post(
  "/purchase",
  verifyJWT,
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

// GET /api/ownership/my-investments
router.get("/my-investments", verifyJWT, ownershipController.getMyInvestments);

module.exports = router;
