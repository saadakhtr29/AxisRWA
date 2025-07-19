const { PrismaClient } = require("@prisma/client");
const { z } = require("zod");
const prisma = new PrismaClient();

const { uploadToCloudinary } = require("../services/cloudinaryService");

// Schema for validating asset input (used for creation and update)
const assetSchema = z.object({
  title: z.string().min(3).max(100),
  valuation: z.coerce.number().positive(),
  tokenSupply: z.coerce.number().int().positive(),
});

/**
 * Uploads an image to Cloudinary and updates the asset with the image URL.
 * - Requires: `multipart/form-data` with `image` field.
 */
const uploadAssetImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    const imageUrl = await uploadToCloudinary(
      req.file.buffer,
      "axisrwa/assets"
    );

    const cloudinaryResult = await uploadToCloudinary(req.file.buffer, "axisrwa/assets");

    const updatedAsset = await prisma.asset.update({
      where: { id: req.params.id },
      data: {
        imageUrl: cloudinaryResult.secure_url,
        cloudinaryPublicId: cloudinaryResult.public_id,
        cloudinaryBytes: cloudinaryResult.bytes,
      },
    });

    return res.status(200).json({
      message: "Image uploaded successfully.",
      asset: updatedAsset,
    });
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return res.status(500).json({ error: "Image upload failed." });
  }
};

/**
 * Creates a new asset associated with the authenticated partner.
 */
const createAsset = async (req, res) => {
  const partnerID = req.user.uid;

  try {
    const parsed = assetSchema.parse(req.body);

    const existing = await prisma.asset.findFirst({
      where: { title: parsed.title, partnerID },
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "Asset with the same title already exists." });
    }

    const newAsset = await prisma.asset.create({
      data: {
        ...parsed,
        partnerID,
      },
    });

    return res.status(201).json(newAsset);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Fetches all approved assets, paginated.
 * Accessible to public users.
 */
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

    return res.json({
      data: assets,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Fetch a specific asset by ID.
 * Publicly accessible.
 */
const getAssetById = async (req, res) => {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: req.params.id },
    });

    if (!asset) {
      return res.status(404).json({ error: "Asset not found." });
    }

    return res.json(asset);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Fetch all assets created by the logged-in partner.
 */
const getPartnerAssets = async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      where: { partnerID: req.user.uid },
      orderBy: { createdAt: "desc" },
    });

    return res.json(assets);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Approves an asset by ID (admin only).
 */
const approveAsset = async (req, res) => {
  try {
    const updated = await prisma.asset.update({
      where: { id: req.params.id },
      data: {
        approved: true,
        // Optionally add approval timestamp and admin ID
        // approvedAt: new Date(),
        // approvedBy: req.user.userId,
      },
    });

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Updates an asset's details.
 * Allowed for owner (partner) or admin.
 */
const updateAsset = async (req, res) => {
  try {
    const parsed = assetSchema.parse(req.body);
    const { id } = req.params;

    const asset = await prisma.asset.findUnique({ where: { id } });

    if (!asset) {
      return res.status(404).json({ error: "Asset not found." });
    }

    if (req.user.role !== "admin" && req.user.uid !== asset.partnerID) {
      return res.status(403).json({ error: "Unauthorized." });
    }

    const updated = await prisma.asset.update({
      where: { id },
      data: parsed,
    });

    return res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Deletes an asset (partner or admin).
 */
const deleteAsset = async (req, res) => {
  const { id } = req.params;

  try {
    const asset = await prisma.asset.findUnique({ where: { id } });

    if (!asset) {
      return res.status(404).json({ error: "Asset not found." });
    }

    if (req.user.role !== "admin" && req.user.uid !== asset.partnerID) {
      return res.status(403).json({ error: "Unauthorized." });
    }

    await prisma.asset.delete({ where: { id } });

    return res.json({ message: "Asset deleted successfully." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Admin-only: fetch all unapproved asset submissions.
 */
const getAllSubmittedAssets = async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      where: { approved: false },
      orderBy: { createdAt: "desc" },
    });

    return res.json(assets);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Reject an asset (admin only) with a reason.
 */
const rejectAsset = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason || reason.trim().length < 3) {
    return res.status(400).json({ error: "Valid rejection reason required." });
  }

  try {
    const updated = await prisma.asset.update({
      where: { id },
      data: {
        status: "rejected",
        rejectionReason: reason,
        rejectedAt: new Date(),
        rejectedBy: req.user.userId,
      },
    });

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  uploadAssetImage,
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
