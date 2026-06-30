const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const reportRoutes = require('./routes/reportRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const requestLogger = require('./middleware/logging/requestLogger');

const { globalErrorHandler, notFoundHandler } = require('./middleware/error/errorHandler');

const app = express();

// Log sandbox security layer initialization status at boot
const { BLOCKED_MODULES, FORBIDDEN_PATTERNS, SUPPORTED_LANGUAGES } = require('./config/sandboxConfig');
console.log(
  `[Sandbox Security] Initialized — ${BLOCKED_MODULES.length} blocked modules, ` +
  `${FORBIDDEN_PATTERNS.length} forbidden patterns, ` +
  `${SUPPORTED_LANGUAGES.length} supported languages`
);


app.use(requestLogger);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/schedules', scheduleRoutes);

app.get('/', (req, res) => {
  res.send('AI Interview Platform API is running...');
});

// Register global error routing bounds
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
