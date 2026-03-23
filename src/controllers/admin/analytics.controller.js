const asyncHandler = require('../../utils/asyncHandler');

const getOverview = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      impressions: 0,
      clicks: 0,
      ctr: 0,
      revenue: 0,
      dateRange: req.query,
    },
  });
});

const getPublisherAnalytics = asyncHandler(async (req, res) => {
  res.json({ success: true, data: [] });
});

const getAdvertiserAnalytics = asyncHandler(async (req, res) => {
  res.json({ success: true, data: [] });
});

module.exports = { getOverview, getPublisherAnalytics, getAdvertiserAnalytics };
