const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  advertiserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  objective: { type: String, enum: ['brand_awareness', 'awareness', 'traffic', 'conversions', 'installs'], required: true },
  publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdSlot' },
  adId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad' },
  startDate: { type: Date },
  endDate: { type: Date },
  dailyBudget: { type: Number, default: 0 },
  totalBudget: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'active', 'paused', 'completed'], default: 'draft' },
  totalImpressions: { type: Number, default: 0 },
  totalClicks: { type: Number, default: 0 },
  totalSpend: { type: Number, default: 0 },
}, { timestamps: true });

campaignSchema.index({ slotId: 1, status: 1 });
campaignSchema.index({ advertiserId: 1, status: 1 });

module.exports = mongoose.model('Campaign', campaignSchema);
