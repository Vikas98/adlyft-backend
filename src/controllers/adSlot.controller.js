const AdSlot = require('../models/AdSlot');
const Publisher = require('../models/Publisher');

const getSlots = async (req, res, next) => {
  try {
    const { publisherId, type, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (publisherId) filter.publisherId = publisherId;
    if (type) filter.type = type;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [slots, total] = await Promise.all([
      AdSlot.find(filter).populate('publisherId', 'name appName').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      AdSlot.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: slots,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

const getSlot = async (req, res, next) => {
  try {
    const slot = await AdSlot.findById(req.params.id).populate('publisherId', 'name appName category');
    if (!slot) return res.status(404).json({ success: false, message: 'Ad slot not found' });
    res.json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

const registerSlot = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return res.status(401).json({ success: false, message: 'Publisher API key required' });

    const publisher = await Publisher.findOne({ apiKey });
    if (!publisher) return res.status(401).json({ success: false, message: 'Invalid publisher API key' });

    const { name, screen, size, type, pricePerMonth, cpm } = req.body;
    const slotId = `${publisher.appName.toLowerCase().replace(/\s+/g, '_')}_${screen}_${type}_${Date.now()}`;

    const slot = await AdSlot.create({
      publisherId: publisher._id,
      slotId,
      name,
      screen: screen || '',
      size: size || '320x50',
      type,
      pricePerMonth: pricePerMonth || 0,
      cpm: cpm || 0,
    });

    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSlots, getSlot, registerSlot };
