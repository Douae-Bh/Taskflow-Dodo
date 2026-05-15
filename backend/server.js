const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const { errorHandler } = require('./src/middlewares/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost',
    'http://localhost:80',
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:3000',
    'http://127.0.0.1',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body));
  }
  next();
});

// ✅ Fonctionnalité 1 — Authentification
app.use('/api/auth', require('./src/routes/authRoutes'));

// 🔒 Décommenter au fur et à mesure :
// app.use('/api/projects',      require('./src/routes/projectRoutes'));       // Feat 2
// app.use('/api/tasks',         require('./src/routes/taskRoutes'));          // Feat 3
// app.use('/api/dashboard',     require('./src/routes/dashboardRoutes'));     // Feat 5
// app.use('/api/projects',      require('./src/routes/memberRoutes'));        // Feat 8
// app.use('/api/notifications', require('./src/routes/notificationRoutes')); // Feat 10
// app.use('/api/projects',      require('./src/routes/activityRoutes'));      // Feat 9

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TaskFlow API is running', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur TaskFlow démarré sur le port ${PORT}`);
  console.log(`API disponible sur http://localhost:${PORT}/api`);
});

module.exports = app;