const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

// GET /api/content — Get public content items (testimonials, FAQs, announcements)
router.get('/content', (req, res) => {
  try {
    const { type } = req.query;
    let sql = 'SELECT * FROM content_items WHERE is_active = 1';
    const params = [];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    sql += ' ORDER BY display_order ASC, updated_at DESC';

    const items = db.query(sql, params).map(item => {
      let metadata = {};
      try {
        metadata = item.metadata_json ? JSON.parse(item.metadata_json) : {};
      } catch (e) { metadata = {}; }
      return { ...item, metadata };
    });

    res.json({ success: true, count: items.length, items });
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve editorial content.' });
  }
});

// POST /api/content — Create CMS item (Admin)
router.post('/content', requireAdmin, (req, res) => {
  try {
    const { type, key, title, content, metadata, display_order } = req.body;
    if (!type || !key || !content) {
      return res.status(400).json({ success: false, message: 'Type, key, and content are required.' });
    }

    const id = `cnt-${Date.now()}`;
    const now = new Date().toISOString();
    const metadataJson = JSON.stringify(metadata || {});

    db.run(`
      INSERT INTO content_items (id, type, key, title, content, metadata_json, is_active, display_order, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
    `, [id, type, key.trim(), title || '', content.trim(), metadataJson, Number(display_order) || 0, now]);

    res.status(201).json({ success: true, item: { id, type, key, title, content } });
  } catch (err) {
    console.error('Error creating content item:', err);
    res.status(500).json({ success: false, message: 'Failed to create editorial content item.' });
  }
});

// PUT /api/content/:id — Edit CMS item (Admin)
router.put('/content/:id', requireAdmin, (req, res) => {
  try {
    const { title, content, metadata, is_active, display_order } = req.body;
    const now = new Date().toISOString();

    db.run(`
      UPDATE content_items SET
        title = COALESCE(?, title),
        content = COALESCE(?, content),
        metadata_json = COALESCE(?, metadata_json),
        is_active = COALESCE(?, is_active),
        display_order = COALESCE(?, display_order),
        updated_at = ?
      WHERE id = ?
    `, [
      title !== undefined ? title : null,
      content !== undefined ? content : null,
      metadata !== undefined ? JSON.stringify(metadata) : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      display_order !== undefined ? Number(display_order) : null,
      now,
      req.params.id
    ]);

    res.json({ success: true, message: 'Content item updated.' });
  } catch (err) {
    console.error('Error updating content item:', err);
    res.status(500).json({ success: false, message: 'Failed to update content item.' });
  }
});

// DELETE /api/content/:id — Delete CMS item (Admin)
router.delete('/content/:id', requireAdmin, (req, res) => {
  try {
    db.run('DELETE FROM content_items WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Content item removed.' });
  } catch (err) {
    console.error('Error deleting content item:', err);
    res.status(500).json({ success: false, message: 'Failed to delete content item.' });
  }
});

module.exports = router;
