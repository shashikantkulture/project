const db = require('../../../db/database');

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const product = db.get('SELECT * FROM products WHERE id = ? OR sku = ?', [id, id]);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Masterpiece artifact not found' });
    }

    const images = product.images_json ? JSON.parse(product.images_json) : [product.image];

    // Fetch related products from same category or featured
    const related = db
      .query('SELECT * FROM products WHERE category = ? AND id != ? LIMIT 3', [product.category, product.id])
      .map((p) => ({
        ...p,
        images: p.images_json ? JSON.parse(p.images_json) : [p.image],
      }));

    return res.status(200).json({
      success: true,
      product: {
        ...product,
        images,
      },
      related,
    });
  } catch (error) {
    console.error('Error fetching single product:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
