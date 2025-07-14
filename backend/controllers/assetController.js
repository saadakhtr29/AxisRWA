const { PrismaClient } = require("@prisma/client");
const { z } = require("zod"); // Zod for input validation
const prisma = new PrismaClient();

// Schema for validating asset input (creation and update)
const assetSchema = z.object({
  title: z.string().min(3).max(100),
  valuation: z.number().positive(),
  tokenSupply: z.number().int().positive(),
});

// CREATE a new asset (partner only)
const createAsset = async (req, res) => {
  const partnerID = req.user.uid;

  try {
    // Validate input
    const parsed = assetSchema.parse(req.body);

    // Optional: prevent duplicate titles for same partner
    const existing = await prisma.asset.findFirst({
      where: { title: parsed.title, partnerID },
    });
    if (existing)
      return res
        .status(409)
        .json({ error: "Asset with same title already exists" });

    // Create asset in DB
    const asset = await prisma.asset.create({
      data: {
        ...parsed,
        partnerID,
      },
    });

    res.status(201).json(asset);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    res.status(500).json({ error: err.message });
  }
};

// GET paginated list of approved assets (public)
const getAllAssets = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where: { approved: true },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.asset.count({ where: { approved: true } }),
    ]);

    res.json({
      data: assets,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET asset by ID (public)
const getAssetById = async (req, res) => {
  const { id } = req.params;

  try {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all assets by logged-in partner
const getPartnerAssets = async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      where: { partnerID: req.user.uid },
      orderBy: { createdAt: "desc" },
    });

    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// APPROVE asset by admin
const approveAsset = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await prisma.asset.update({
      where: { id },
      data: {
        approved: true,
        approvedAt: new Date(),
        approvedBy: req.user.uid,
      },
    });

    // Optional: notify partner via Notification model here

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE asset (partner or admin)
const updateAsset = async (req, res) => {
  const { id } = req.params;

  try {
    const parsed = assetSchema.parse(req.body);

    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    // Only owner or admin can update
    if (req.user.role !== "admin" && req.user.uid !== asset.partnerID)
      return res.status(403).json({ error: "Forbidden" });

    const updated = await prisma.asset.update({
      where: { id },
      data: parsed,
    });

    res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    res.status(500).json({ error: err.message });
  }
};

// DELETE asset (partner or admin)
const deleteAsset = async (req, res) => {
  const { id } = req.params;

  try {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    // Only owner or admin can delete
    if (req.user.role !== "admin" && req.user.uid !== asset.partnerID)
      return res.status(403).json({ error: "Forbidden" });

    await prisma.asset.delete({ where: { id } });

    res.json({ message: "Asset deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all unapproved assets (admin only)
const getAllSubmittedAssets = async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      where: { approved: false },
      orderBy: { createdAt: "desc" },
    });

    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REJECT asset by admin
const rejectAsset = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason || reason.trim().length < 3)
    return res.status(400).json({ error: "Rejection reason is required." });

  try {
    const updated = await prisma.asset.update({
      where: { id },
      data: {
        status: "rejected",
        rejectionReason: reason,
        rejectedAt: new Date(),
        rejectedBy: req.user.uid,
      },
    });

    // Optional: notify partner

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createAsset,
  getAllAssets,
  getAssetById,
  getPartnerAssets,
  approveAsset,
  updateAsset,
  deleteAsset,
  getAllSubmittedAssets,
  rejectAsset,
};
