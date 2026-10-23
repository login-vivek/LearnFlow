const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:        { type: String, required: true }, // "YYYY-MM-DD"
  solvedCount: { type: Number, default: 0 },
  minutesStudied: { type: Number, default: 0 },
  topics:      { type: [String], default: [] },
  potdSolved:  { type: Boolean, default: false },
}, { timestamps: true });

progressSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
