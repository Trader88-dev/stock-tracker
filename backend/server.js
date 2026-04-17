const express = require('express');
console.log("🔥 VERSION DEPLOY ACTIVE");
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS
const corsOptions = {
  origin: ['https://stockradar-live.netlify.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // 🔥 Ajoute cette ligne ici
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté ✅'))
  .catch((err) => console.log('Erreur MongoDB:', err));

// test route
app.get('/', (req, res) => {
  res.send('OK BACKEND');
});

app.get('/api/auth/ping', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/favorites', require('./routes/favorites'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT} ✅`));