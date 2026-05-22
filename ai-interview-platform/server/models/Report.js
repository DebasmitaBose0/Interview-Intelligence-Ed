const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true,
  },
  overallScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  breakdown: {
    syntaxAccuracy: { type: Number, default: 0 },
    systemScalability: { type: Number, default: 0 },
    verbalCommunication: { type: Number, default: 0 },
    complexityOptimization: { type: Number, default: 0 },
  },
  feedbackLogs: [
    { type: String }
  ],
  createdTime: {
    type: String,
    default: () => new Date().toLocaleString(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', ReportSchema);