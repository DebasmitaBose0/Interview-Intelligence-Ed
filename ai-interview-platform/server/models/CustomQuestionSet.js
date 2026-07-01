const mongoose = require('mongoose');

const CustomQuestionSetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'custom'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CustomQuestionSet', CustomQuestionSetSchema);
