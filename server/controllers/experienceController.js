const Experience = require('../models/Experience');

exports.getExperiences = async (req, res) => {
  try {
    const { company, result, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (company) filter.company = { $regex: company, $options: 'i' };
    if (result)  filter.result  = result;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Experience.countDocuments(filter);
    const experiences = await Experience.find(filter)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Mask author name if anonymous
    const sanitized = experiences.map(e => {
      const obj = e.toObject();
      if (obj.anonymous) obj.user = { name: 'Anonymous' };
      return obj;
    });

    res.json({ success: true, experiences: sanitized, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getExperience = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id).populate('user', 'name');
    if (!exp) return res.status(404).json({ success: false, message: 'Not found' });
    const obj = exp.toObject();
    if (obj.anonymous) obj.user = { name: 'Anonymous' };
    res.json({ success: true, experience: obj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createExperience = async (req, res) => {
  try {
    const { company, role, year, result, difficulty, overview, rounds, tips, anonymous } = req.body;
    if (!company || !role || !year)
      return res.status(400).json({ success: false, message: 'company, role and year are required' });

    const exp = await Experience.create({
      user: req.user._id, company, role, year, result, difficulty,
      overview, rounds: rounds || [], tips, anonymous: !!anonymous,
    });
    res.status(201).json({ success: true, experience: exp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.likeExperience = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ success: false, message: 'Not found' });

    const uid   = req.user._id.toString();
    const liked = exp.likes.map(l => l.toString()).includes(uid);
    if (liked) {
      exp.likes = exp.likes.filter(l => l.toString() !== uid);
    } else {
      exp.likes.push(req.user._id);
    }
    await exp.save();
    res.json({ success: true, likes: exp.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
