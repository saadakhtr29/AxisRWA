const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const roiService = require("../services/roiService");

const prisma = new PrismaClient();

// Schedule the job: At 00:00 on the 1st of every month
const distributeMonthlyROI = cron.schedule("0 0 1 * *", async () => {
  console.log("Running monthly ROI distribution job...");

  try {
    // Get all approved assets
    const assets = await prisma.asset.findMany({
      where: { approved: true }
    });

    const currentPeriod = new Date().toISOString().slice(0, 7); // e.g. "2025-06"

    for (const asset of assets) {
      // Assume revenueAmount is fetched from POS or a placeholder for now
      const revenueData = await prisma.revenueReport.findFirst({
        where: {
          assetId: asset.id,
          period: currentPeriod
        }
      });

      if (!revenueData) {
        console.log(`No revenue report for asset ${asset.title} (${asset.id}) in ${currentPeriod}`);
        continue;
      }

      const distributed = await roiService.distributeROIForAsset(
        asset.id,
        revenueData.revenueAmount,
        currentPeriod
      );

      console.log(`Distributed ROI for ${asset.title}:`, distributed.length, "investors");
    }

    console.log("Monthly ROI distribution complete.");
  } catch (err) {
    console.error("Monthly ROI distribution failed:", err);
  }
}, {
  scheduled: false // Don't auto-start (will start it from server)
});

module.exports = distributeMonthlyROI;
