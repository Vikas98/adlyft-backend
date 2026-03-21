const Invoice = require('../models/Invoice');
const Campaign = require('../models/Campaign');

const getBillingOverview = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({ advertiserId: req.user._id });
    const totalSpent = campaigns.reduce((sum, c) => sum + c.totalSpend, 0);

    const invoices = await Invoice.find({ advertiserId: req.user._id });
    const pendingInvoices = invoices.filter(i => i.status === 'pending');
    const nextInvoice = pendingInvoices.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

    res.json({
      success: true,
      data: {
        totalSpent,
        currentBalance: pendingInvoices.reduce((sum, i) => sum + i.amount, 0),
        nextInvoiceDate: nextInvoice ? nextInvoice.dueDate : null,
        paidInvoices: invoices.filter(i => i.status === 'paid').length,
        pendingInvoices: pendingInvoices.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getInvoices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { advertiserId: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [invoices, total] = await Promise.all([
      Invoice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Invoice.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: invoices,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, advertiserId: req.user._id });
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBillingOverview, getInvoices, getInvoice };
