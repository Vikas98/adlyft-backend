const Campaign = require('../../models/Campaign');
const Ad = require('../../models/Ad');
const asyncHandler = require('../../utils/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  const advertiserId = req.user._id;
  const [totalCampaigns, activeCampaigns, totalAds] = await Promise.all([
    Campaign.countDocuments({ advertiser: advertiserId }),
    Campaign.countDocuments({ advertiser: advertiserId, status: 'active' }),
    Ad.countDocuments({ advertiser: advertiserId }),
  ]);

  const campaigns = await Campaign.find({ advertiser: advertiserId });
  const totalSpent = campaigns.reduce((sum, c) => sum + (c.spent || 0), 0);

  res.json({
    success: true,
    data: {
      totalCampaigns,
      activeCampaigns,
      totalAds,
      totalSpent,
      totalImpressions: 0,
      totalClicks: 0,
      avgCTR: 0,
    },
  });
});

module.exports = { getStats };
