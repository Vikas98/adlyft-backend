const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  advertiser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  budget: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['draft', 'active', 'paused', 'ended', 'pending_approval'], default: 'draft' },
  targetCategory: { type: String, default: '' },
}, { timestamps: true });

campaignSchema.index({ advertiser: 1, status: 1 });

module.exports = mongoose.model('Campaign', campaignSchema);
