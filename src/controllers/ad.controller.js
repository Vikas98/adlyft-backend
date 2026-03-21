const Ad = require('../models/Ad');
const Activity = require('../models/Activity');
const path = require('path');

const uploadAd = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    const { campaignId, clickUrl, altText, size } = req.body;
    const ext = path.extname(req.file.originalname).toLowerCase().slice(1);
    const format = ['jpg', 'jpeg', 'png', 'gif'].includes(ext) ? (ext === 'jpeg' ? 'jpg' : ext) : 'jpg';

    const ad = await Ad.create({
      advertiserId: req.user._id,
      campaignId: campaignId || null,
      imageUrl: `/uploads/${req.file.filename}`,
      clickUrl: clickUrl || '',
      altText: altText || '',
      size: size || '320x50',
      format,
      status: 'pending_review',
    });

    await Activity.create({
      userId: req.user._id,
      type: 'ad_uploaded',
      message: `New ad creative uploaded`,
      metadata: { adId: ad._id },
    });

    res.status(201).json({ success: true, data: ad });
  } catch (error) {
    next(error);
  }
};

const getAd = async (req, res, next) => {
  try {
    const ad = await Ad.findOne({ _id: req.params.id, advertiserId: req.user._id });
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });
    res.json({ success: true, data: ad });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadAd, getAd };
