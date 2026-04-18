const express = require('express');
const router = express.Router();
const axios = require('axios');

// Rechercher une action
router.get('/search/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log('🔍 Recherche:', symbol);
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_KEY}`
    );
    console.log('📊 Réponse Alpha Vantage:', JSON.stringify(response.data));

    const quote = response.data['Global Quote'];
    if (!quote || !quote['05. price']) {
      return res.status(404).json({ message: 'Action introuvable' });
    }

    res.json({
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']).toFixed(2),
      change: parseFloat(quote['09. change']).toFixed(2),
      changePercent: quote['10. change percent'],
      high: parseFloat(quote['03. high']).toFixed(2),
      low: parseFloat(quote['04. low']).toFixed(2),
      volume: quote['06. volume']
    });

  } catch (err) {
    console.log('❌ Erreur:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Graphique historique
router.get('/history/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log('📈 Historique:', symbol);
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_KEY}`
    );
    console.log('📊 Réponse historique:', JSON.stringify(response.data).slice(0, 200));

    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) {
      return res.status(404).json({ message: 'Données introuvables' });
    }

    const history = Object.entries(timeSeries)
      .slice(0, 30)
      .map(([date, values]) => ({
        date,
        price: parseFloat(values['4. close']).toFixed(2)
      }))
      .reverse();

    res.json(history);

  } catch (err) {
    console.log('❌ Erreur historique:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;