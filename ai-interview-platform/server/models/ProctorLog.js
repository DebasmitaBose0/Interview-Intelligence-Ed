import mongoose from 'mongoose';

const proctorLogSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewId: {
    type: String,
    required: true
  },
  violationType: {
    type: String,
    enum: ['tab_switch', 'window_blur', 'multiple_faces', 'no_face_detected', 'stream_tampering', 'identity_mismatch'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  details: {
    type: String,
    default: ''
  },
  capturedFrameUrl: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  }
}, {
  timestamps: true
});

proctorLogSchema.index({ candidateId: 1, interviewId: 1 });
proctorLogSchema.index({ createdAt: -1 });

const ProctorLog = mongoose.model('ProctorLog', proctorLogSchema);
export default ProctorLog;
