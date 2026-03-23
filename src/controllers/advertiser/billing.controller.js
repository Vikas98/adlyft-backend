const asyncHandler = require('../../utils/asyncHandler');

const getBillingSummary = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      totalSpent: 0,
      availableBalance: 0,
      currency: 'USD',
    },
  });
});

const listInvoices = asyncHandler(async (req, res) => {
  res.json({ success: true, data: [] });
});

const getInvoice = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { id: req.params.id, amount: 0, status: 'mock' } });
});

module.exports = { getBillingSummary, listInvoices, getInvoice };
