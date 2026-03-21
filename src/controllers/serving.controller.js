const Ad = require('../models/Ad');
const AdSlot = require('../models/AdSlot');
const Campaign = require('../models/Campaign');
const Impression = require('../models/Impression');
const Click = require('../models/Click');
const { getCache, setCache, incrementCounter } = require('../config/redis');

const serveAd = async (req, res, next) => {
  try {
    const { slot_id } = req.query;
    if (!slot_id) return res.status(400).json({ success: false, message: 'slot_id is required' });

    const cacheKey = `ad:slot:${slot_id}`;
    let adData = await getCache(cacheKey);

    if (!adData) {
      const slot = await AdSlot.findOne({ slotId: slot_id });
      if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });

      const campaign = await Campaign.findOne({ slotId: slot._id, status: 'active' }).populate('adId');
      if (!campaign || !campaign.adId) {
        return res.status(404).json({ success: false, message: 'No active ad for this slot' });
      }

      const ad = campaign.adId;
      adData = {
        ad_id: ad._id,
        campaign_id: campaign._id,
        publisher_id: slot.publisherId,
        slot_id: slot._id,
        image_url: ad.imageUrl,
        click_url: `/api/serve/click/${ad._id}`,
        impression_url: `/api/serve/impression/${ad._id}`,
        alt_text: ad.altText,
        size: ad.size,
      };
      await setCache(cacheKey, adData, 60);
    }

    res.json({ success: true, data: adData });
  } catch (error) {
    next(error);
  }
};

const trackImpression = async (req, res, next) => {
  try {
    const { adId } = req.params;
    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });

    const campaign = await Campaign.findOne({ adId, status: 'active' });
    if (!campaign) return res.status(404).json({ success: false, message: 'No active campaign for this ad' });

    await Impression.create({
      adId,
      campaignId: campaign._id,
      publisherId: campaign.publisherId,
      slotId: campaign.slotId,
    });

    await Campaign.findByIdAndUpdate(campaign._id, { $inc: { totalImpressions: 1 } });
    await incrementCounter(`impressions:${campaign._id}`);

    res.json({ success: true, message: 'Impression tracked' });
  } catch (error) {
    next(error);
  }
};

const trackClick = async (req, res, next) => {
  try {
    const { adId } = req.params;
    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ success: false, message: 'Ad not found' });

    const campaign = await Campaign.findOne({ adId, status: 'active' });
    if (!campaign) return res.redirect(ad.clickUrl || '/');

    await Click.create({
      adId,
      campaignId: campaign._id,
      publisherId: campaign.publisherId,
      slotId: campaign.slotId,
    });

    await Campaign.findByIdAndUpdate(campaign._id, { $inc: { totalClicks: 1 } });
    await incrementCounter(`clicks:${campaign._id}`);

    res.redirect(ad.clickUrl || '/');
  } catch (error) {
    next(error);
  }
};

module.exports = { serveAd, trackImpression, trackClick };
