const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  advertiserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
  dueDate: { type: Date },
  paidDate: { type: Date },
  items: [{
    campaignId: { type: mongoose.Schema.Types.ObjectId },
    campaignName: { type: String },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
