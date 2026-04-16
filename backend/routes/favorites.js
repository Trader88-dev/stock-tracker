const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Favorite = require('../models/Favorite');

// Récupérer les favoris
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Ajouter un favori
router.post('/', auth, async (req, res) => {
  try {
    const { symbol, name } = req.body;

    const existing = await Favorite.findOne({ userId: req.userId, symbol });
    if (existing) {
      return res.status(400).json({ message: 'Déjà dans les favoris' });
    }

    const favorite = new Favorite({ userId: req.userId, symbol, name });
    await favorite.save();
    res.status(201).json(favorite);

  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un favori
router.delete('/:symbol', auth, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ userId: req.userId, symbol: req.params.symbol });
    res.json({ message: 'Favori supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;