const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:   { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, default: '' },
  tags:    { type: [String], default: [] },
  pinned:  { type: Boolean, default: false },
  color:   { type: String, default: 'default' }, // default | blue | green | purple | yellow
}, { timestamps: true });

noteSchema.index({ user: 1, createdAt: -1 });

const snippetSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, required: true, trim: true, maxlength: 200 },
  code:     { type: String, default: '' },
  language: { type: String, default: 'java' },
  problem:  { type: String, default: '' },
  tags:     { type: [String], default: [] },
  pinned:   { type: Boolean, default: false },
}, { timestamps: true });

snippetSchema.index({ user: 1, createdAt: -1 });

const Note    = mongoose.model('Note', noteSchema);
const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = { Note, Snippet };
