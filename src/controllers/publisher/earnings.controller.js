const asyncHandler = require('../../utils/asyncHandler');

const getEarnings = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      totalEarnings: 0,
      pendingPayout: 0,
      paidOut: 0,
      payoutHistory: [],
    },
  });
});

module.exports = { getEarnings };
