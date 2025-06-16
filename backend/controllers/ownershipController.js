const ownershipService = require("../services/ownershipService");
const { validationResult } = require("express-validator");

exports.purchaseOwnership = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { userId } = req.user;
    const { assetId, quantity, txHash } = req.body;

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

exports.getInvestorsByAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    const records = await ownershipService.getOwnershipByAsset(assetId);
    res.json(records);
  } catch (err) {
    console.error("Fetch Investors Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOwnershipById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await ownershipService.getOwnershipById(id);
    if (!record) {
      return res.status(404).json({ error: "Ownership not found" });
    }
    res.json(record);
  } catch (err) {
    console.error("Fetch Ownership Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.revokeOwnership = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const deleted = await ownershipService.deleteOwnership(id);
    if (!deleted) {
      return res.status(404).json({ error: "Ownership not found" });
    }
    res.json({ message: "Ownership revoked successfully" });
  } catch (err) {
    console.error("Revoke Ownership Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
