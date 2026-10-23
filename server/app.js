const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/plan',        require('./routes/planRoutes'));
app.use('/api/progress',    require('./routes/progressRoutes'));
app.use('/api/ai',          require('./routes/aiRoutes'));
app.use('/api/problems',    require('./routes/problemRoutes'));
app.use('/api/notes',       require('./routes/notesRoutes'));
app.use('/api/experiences', require('./routes/experienceRoutes'));
app.use('/api/aptitude',    require('./routes/aptitudeRoutes'));

app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'TUF Clone API running', port: process.env.PORT || 5000 })
);

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message || 'Server error' });
});

module.exports = app;
