const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundName:   { type: String, required: true }, // "Online Test", "Technical 1", "HR"
  description: { type: String, default: '' },
  questions:   { type: [String], default: [] },
  result:      { type: String, enum: ['cleared', 'rejected', 'pending'], default: 'pending' },
});

const experienceSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company:     { type: String, required: true, trim: true },
  role:        { type: String, required: true, trim: true },
  year:        { type: Number, required: true },
  result:      { type: String, enum: ['selected', 'rejected', 'pending'], default: 'pending' },
  difficulty:  { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  overview:    { type: String, default: '' },
  rounds:      [roundSchema],
  tips:        { type: String, default: '' },
  likes:       { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  anonymous:   { type: Boolean, default: false },
}, { timestamps: true });

experienceSchema.index({ company: 1, createdAt: -1 });

module.exports = mongoose.model('Experience', experienceSchema);
