const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  date:      { type: String, required: true }, // "YYYY-MM-DD"
  topic:     { type: String, required: true },
  subtopic:  { type: String, default: '' },
  duration:  { type: Number, default: 60 }, // minutes
  completed: { type: Boolean, default: false },
  skipped:   { type: Boolean, default: false },
  rescheduled: { type: Boolean, default: false },
});

const studyPlanSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetCompany: { type: String, required: true },
  targetRole:    { type: String, required: true },
  hoursPerDay:   { type: Number, required: true },
  deadline:      { type: String, required: true },
  startDate:     { type: String, required: true },
  tasks:         [taskSchema],
  active:        { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
