const mongoose = require('mongoose');

const adSlotSchema = new mongoose.Schema({
  publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher', required: true },
  slotId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  screen: { type: String, default: '' },
  size: { type: String, default: '320x50' },
  type: { type: String, enum: ['banner', 'interstitial', 'native', 'fullscreen'], required: true },
  pricePerMonth: { type: Number, default: 0 },
  cpm: { type: Number, default: 0 },
  status: { type: String, enum: ['available', 'booked', 'inactive'], default: 'available' },
}, { timestamps: true });

module.exports = mongoose.model('AdSlot', adSlotSchema);
