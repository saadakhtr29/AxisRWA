const roiService = require("../services/roiService");

exports.getMyRoiTokens = async (req, res) => {
  try {
    const { userId } = req.user;
    const roiTokens = await roiService.getUserRoiTokens(userId);
    res.json(roiTokens);
  } catch (error) {
    console.error("Fetch ROI tokens error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMyRoiHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const history = await roiService.getUserRoiHistory(userId);
    res.json(history);
  } catch (error) {
    console.error("Fetch ROI history error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRoiForAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    const result = await roiService.getRoiByAsset(assetId);
    res.json(result);
  } catch (error) {
    console.error("Fetch ROI by asset error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.triggerRoiDistribution = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }

    const result = await roiService.distributeRoi();
    res.json({ message: "ROI distributed successfully", result });
  } catch (error) {
    console.error("Manual ROI distribution error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
