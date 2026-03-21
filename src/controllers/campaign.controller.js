const Campaign = require('../models/Campaign');
const Activity = require('../models/Activity');

const getCampaigns = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { advertiserId: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [campaigns, total] = await Promise.all([
      Campaign.find(filter)
        .populate('publisherId', 'name appName')
        .populate('slotId', 'name size type')
        .populate('adId', 'imageUrl clickUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Campaign.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: campaigns,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

const getCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, advertiserId: req.user._id })
      .populate('publisherId')
      .populate('slotId')
      .populate('adId');
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    res.json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

const createCampaign = async (req, res, next) => {
  try {
    const { name, objective, publisherId, slotId, adId, startDate, endDate, dailyBudget, totalBudget } = req.body;
    const campaign = await Campaign.create({
      advertiserId: req.user._id,
      name, objective, publisherId, slotId, adId, startDate, endDate,
      dailyBudget: dailyBudget || 0,
      totalBudget: totalBudget || 0,
      status: 'draft',
    });

    await Activity.create({
      userId: req.user._id,
      type: 'campaign_created',
      message: `Campaign "${name}" was created`,
      metadata: { campaignId: campaign._id },
    });

    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

const updateCampaign = async (req, res, next) => {
  try {
    const { name, startDate, endDate, dailyBudget, totalBudget, status, publisherId, slotId, adId, objective } = req.body;
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, advertiserId: req.user._id },
      { name, startDate, endDate, dailyBudget, totalBudget, status, publisherId, slotId, adId, objective },
      { new: true, runValidators: true }
    );
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    res.json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

const updateCampaignStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['draft', 'active', 'paused', 'completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, advertiserId: req.user._id },
      { status },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });

    let activityType = 'campaign_created';
    if (status === 'active') activityType = 'campaign_launched';
    if (status === 'paused') activityType = 'campaign_paused';

    await Activity.create({
      userId: req.user._id,
      type: activityType,
      message: `Campaign "${campaign.name}" status changed to ${status}`,
      metadata: { campaignId: campaign._id, status },
    });

    res.json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

const deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, advertiserId: req.user._id });
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    if (campaign.status !== 'draft') {
      return res.status(400).json({ success: false, message: 'Only draft campaigns can be deleted' });
    }
    await campaign.deleteOne();
    res.json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCampaigns, getCampaign, createCampaign, updateCampaign, updateCampaignStatus, deleteCampaign };
