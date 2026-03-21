const mongoose = require('mongoose');

const impressionSchema = new mongoose.Schema({
  adId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad', required: true },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdSlot', required: true },
  timestamp: { type: Date, default: Date.now },
});

impressionSchema.index({ timestamp: 1 });
impressionSchema.index({ campaignId: 1, timestamp: 1 });

module.exports = mongoose.model('Impression', impressionSchema);
