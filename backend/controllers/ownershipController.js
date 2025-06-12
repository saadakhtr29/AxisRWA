const ownershipService = require("../services/ownershipService");
const { validationResult } = require("express-validator");

exports.purchaseOwnership = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { userId } = req.user; // populated via verifyJWT
    const { assetId, quantity, txHash } = req.body;

    // Duplicate transaction check
    const existing = await ownershipService.getByTxHash(txHash);
    if (existing) {
      return res.status(409).json({ error: "Duplicate transaction hash" });
    }

    const ownership = await ownershipService.createOwnershipRecord(
      userId,
      assetId,
      quantity,
      txHash
    );
    res.status(201).json({ ownership });
  } catch (error) {
    console.error("Ownership Purchase Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMyInvestments = async (req, res) => {
  try {
    const { userId } = req.user;
    const investments = await ownershipService.getOwnershipByUser(userId);
    res.json(investments);
  } catch (err) {
    console.error("Fetch Investments Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
