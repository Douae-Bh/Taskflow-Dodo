
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

connectDB();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', require('./src/routes/authRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'API TaskFlow - Fonctionnalité 1: Authentification' });
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

module.exports = app;


