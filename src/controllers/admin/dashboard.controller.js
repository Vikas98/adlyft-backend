const User = require('../../models/User');
const Campaign = require('../../models/Campaign');
const Ad = require('../../models/Ad');
const AdSlot = require('../../models/AdSlot');
const asyncHandler = require('../../utils/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  const [
    totalPublishers,
    totalAdvertisers,
    totalCampaigns,
    totalAds,
    pendingPublishers,
    pendingAds,
  ] = await Promise.all([
    User.countDocuments({ role: 'publisher' }),
    User.countDocuments({ role: 'advertiser' }),
    Campaign.countDocuments(),
    Ad.countDocuments(),
    User.countDocuments({ role: 'publisher', status: 'pending' }),
    Ad.countDocuments({ status: 'pending' }),
  ]);

  res.json({
    success: true,
    data: {
      totalPublishers,
      totalAdvertisers,
      totalCampaigns,
      totalAds,
      pendingPublishers,
      pendingAds,
      totalImpressions: 0,
      totalClicks: 0,
      totalRevenue: 0,
    },
  });
});

module.exports = { getStats };
