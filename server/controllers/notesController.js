const { Note, Snippet } = require('../models/Note');

// ── Notes ──────────────────────────────────────────────────────────────────

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ pinned: -1, updatedAt: -1 });
    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { title, content = '', tags = [], color = 'default', pinned = false } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title required' });
    const note = await Note.create({ user: req.user._id, title, content, tags, color, pinned });
    res.status(201).json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Snippets ───────────────────────────────────────────────────────────────

exports.getSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find({ user: req.user._id }).sort({ pinned: -1, updatedAt: -1 });
    res.json({ success: true, snippets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSnippet = async (req, res) => {
  try {
    const { title, code = '', language = 'java', problem = '', tags = [], pinned = false } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title required' });
    const snippet = await Snippet.create({ user: req.user._id, title, code, language, problem, tags, pinned });
    res.status(201).json({ success: true, snippet });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!snippet) return res.status(404).json({ success: false, message: 'Snippet not found' });
    res.json({ success: true, snippet });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!snippet) return res.status(404).json({ success: false, message: 'Snippet not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
