const Progress = require('../models/Progress');
const User = require('../models/User');

exports.logProgress = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { solvedCount = 0, minutesStudied = 0, topics = [], potdSolved = false } = req.body;

    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id, date: today },
      { $inc: { solvedCount, minutesStudied }, $addToSet: { topics: { $each: topics } }, potdSolved },
      { upsert: true, new: true }
    );

    // Update streak
    const user = await User.findById(req.user._id);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];
    const lastActive = user.lastActiveDate ? user.lastActiveDate.toISOString().split('T')[0] : null;

    if (lastActive === yStr || lastActive === today) {
      if (lastActive !== today) user.streak += 1;
    } else {
      user.streak = 1;
    }
    user.lastActiveDate = new Date();
    await user.save();

    res.json({ success: true, progress, streak: user.streak });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const from = new Date();
    from.setDate(from.getDate() - days);
    const fromStr = from.toISOString().split('T')[0];

    const progress = await Progress.find({
      user: req.user._id,
      date: { $gte: fromStr }
    }).sort({ date: 1 });

    res.json({ success: true, progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, streak: user.streak, lastActiveDate: user.lastActiveDate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
