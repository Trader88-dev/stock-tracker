const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: ['https://stockradar-live.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté ✅'))
  .catch((err) => console.log('Erreur MongoDB:', err));

// ← ajoute cette ligne
app.get('/api/auth/ping', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/favorites', require('./routes/favorites'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT} ✅`));