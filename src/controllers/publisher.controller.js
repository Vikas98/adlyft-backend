const Publisher = require('../models/Publisher');
const AdSlot = require('../models/AdSlot');

const getPublishers = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10, status = 'active' } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { appName: { $regex: search, $options: 'i' } },
    ];

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [publishers, total] = await Promise.all([
      Publisher.find(filter).sort({ dau: -1 }).skip(skip).limit(parseInt(limit)),
      Publisher.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: publishers,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

const getPublisher = async (req, res, next) => {
  try {
    const publisher = await Publisher.findById(req.params.id);
    if (!publisher) return res.status(404).json({ success: false, message: 'Publisher not found' });
    const slots = await AdSlot.find({ publisherId: req.params.id });
    res.json({ success: true, data: { ...publisher.toObject(), slots } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublishers, getPublisher };
