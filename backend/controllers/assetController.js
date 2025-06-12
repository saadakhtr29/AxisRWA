const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createAsset = async (req, res) => {
  const { title, valuation, tokenSupply } = req.body;
  const partnerID = req.user.uid;

  try {
    const asset = await prisma.asset.create({
      data: {
        title,
        valuation: parseFloat(valuation),
        tokenSupply: parseInt(tokenSupply),
        partnerID,
      },
    });
    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllAssets = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const assets = await prisma.asset.findMany({
      where: { approved: true },
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

const approveAsset = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await prisma.asset.update({
      where: { id },
      data: { approved: true },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAsset = async (req, res) => {
  const { id } = req.params;
  const { title, valuation, tokenSupply } = req.body;

  try {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    if (req.user.role !== "admin" && req.user.uid !== asset.partnerID)
      return res.status(403).json({ error: "Forbidden" });

    const updated = await prisma.asset.update({
      where: { id },
      data: {
        title,
        valuation: parseFloat(valuation),
        tokenSupply: parseInt(tokenSupply),
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAsset = async (req, res) => {
  const { id } = req.params;

  try {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    if (req.user.role !== "admin" && req.user.uid !== asset.partnerID)
      return res.status(403).json({ error: "Forbidden" });

    await prisma.asset.delete({ where: { id } });
    res.json({ message: "Asset deleted successfully" });
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
};
