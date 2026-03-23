const AdSlot = require('../../models/AdSlot');
const Ad = require('../../models/Ad');
const asyncHandler = require('../../utils/asyncHandler');

const getStats = asyncHandler(async (req, res) => {
  const publisherId = req.user._id;
  const [totalSlots, activeSlots, pendingAds] = await Promise.all([
    AdSlot.countDocuments({ publisher: publisherId }),
    AdSlot.countDocuments({ publisher: publisherId, status: 'active' }),
    Ad.countDocuments({ publisher: publisherId, status: 'pending' }),
  ]);

  res.json({
    success: true,
    data: {
      totalSlots,
      activeSlots,
      totalImpressions: 0,
      totalClicks: 0,
      totalRevenue: 0,
      pendingAds,
    },
  });
});

module.exports = { getStats };
