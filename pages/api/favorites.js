const db = require('../../db/database');
const { getUserFromRequest } = require('../../lib/authHelper');

export default async function handler(req, res) {
  const user = getUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Sign-in required' });
  }

  if (req.method === 'GET') {
    try {
      const rows = db.query(
        `SELECT p.* FROM favorites f
         JOIN products p ON f.product_id = p.id
         WHERE f.user_id = ?`,
        [user.id]
      );
      const items = rows.map((p) => ({
        ...p,
        images: p.images_json ? JSON.parse(p.images_json) : [p.image],
      }));
      return res.status(200).json({ success: true, favorites: items });
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Failed to fetch favorites' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { productId } = req.body;
      if (!productId) return res.status(400).json({ success: false, error: 'Product id required' });

      const existing = db.get('SELECT id FROM favorites WHERE user_id = ? AND product_id = ?', [user.id, productId]);
      if (existing) {
        db.run('DELETE FROM favorites WHERE id = ?', [existing.id]);
        return res.status(200).json({ success: true, action: 'removed', productId });
      } else {
        const now = new Date().toISOString();
        db.run('INSERT INTO favorites (id, user_id, product_id, created_at) VALUES (?, ?, ?, ?)', [
          `fav-${Date.now()}`,
          user.id,
          productId,
          now,
        ]);
        return res.status(200).json({ success: true, action: 'added', productId });
      }
    } catch (e) {
      return res.status(500).json({ success: false, error: 'Failed to update wishlist' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
