const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const reportRoutes = require('./routes/reportRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/resume', resumeRoutes);

app.get('/', (req, res) => {
  res.send('AI Interview Platform API is running...');
});

// ── Error Handling ──────────────────────────────────────────────────
// Catch-all for unmatched routes — must be placed after all route registrations
app.use(notFoundHandler);

// Global error handler — must be the very last middleware in the chain
app.use(globalErrorHandler);

module.exports = app;