const mongoose = require('mongoose');

const proctorLogSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    candidateId: {
      type: String,
      required: true,
      index: true,
    },
    violationType: {
      type: String,
      enum: ['TAB_SWITCH', 'MULTIPLE_FACES', 'NO_FACE_DETECTED', 'AUDIO_ANOMALY', 'DEV_TOOLS_OPEN', 'FULLSCREEN_EXIT'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

proctorLogSchema.index({ sessionId: 1, timestamp: -1 });

module.exports = mongoose.model('ProctorLog', proctorLogSchema);
