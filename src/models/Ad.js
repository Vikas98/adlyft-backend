const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  advertiser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'AdSlot', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, required: true }, // S3 URL
  destinationUrl: { type: String, required: true }, // click-through URL
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'active', 'paused'], default: 'pending' },
  adminNote: { type: String, default: '' },
  approvedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

adSchema.index({ advertiser: 1, status: 1 });
adSchema.index({ publisher: 1, status: 1 });
adSchema.index({ adSlot: 1, status: 1 });

module.exports = mongoose.model('Ad', adSchema);
