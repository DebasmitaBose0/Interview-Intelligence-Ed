const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  extractedText: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  education: {
    type: [String],
    default: [],
  },
  experience: {
    type: [String],
    default: [],
  },
  projects: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resume', ResumeSchema);
