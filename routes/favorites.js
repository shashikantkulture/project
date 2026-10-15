const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { authenticateUser } = require('../middleware/auth');

// GET /api/favorites — Get user's favorites
router.get('/favorites', authenticateUser, (req, res) => {
  try {
    const favorites = db.query(`
      SELECT p.*, f.created_at as saved_at
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `, [req.user.id]);

    res.json({ success: true, count: favorites.length, favorites });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve saved favorites.' });
  }
});

// POST /api/favorites — Toggle favorite
router.post('/favorites', authenticateUser, (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'Product ID required.' });

    const existing = db.get('SELECT id FROM favorites WHERE user_id = ? AND product_id = ?', [req.user.id, productId]);

    if (existing) {
      db.run('DELETE FROM favorites WHERE id = ?', [existing.id]);
      return res.json({ success: true, isFavorite: false, message: 'Removed from saved favorites.' });
    } else {
      const id = `fav-${Date.now()}`;
      const now = new Date().toISOString();
      db.run('INSERT INTO favorites (id, user_id, product_id, created_at) VALUES (?, ?, ?, ?)', [id, req.user.id, productId, now]);
      return res.json({ success: true, isFavorite: true, message: 'Added to your saved favorites.' });
    }
  } catch (err) {
    console.error('Error toggling favorite:', err);
    res.status(500).json({ success: false, message: 'Failed to update favorites.' });
  }
});

module.exports = router;
