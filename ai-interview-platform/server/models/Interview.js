const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    required: [true, 'Please specify the target interview role'],
  },
  experience: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  jobDescription: {
    type: String,
    default: '',
  },
  questions: [
    {
      questionText: { type: String, required: true },
      candidateAnswer: { type: String, default: '' },
    }
  ],
  status: {
    type: String,
    enum: ['initialized', 'speaking_active', 'coding_active', 'completed'],
    default: 'initialized',
  },
  finalCode: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Interview', InterviewSchema);