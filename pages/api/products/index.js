const db = require('../../../db/database');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { category, minPrice, maxPrice, vastu, sort, search, featured } = req.query;

    let sql = 'SELECT * FROM products WHERE is_published = 1';
    const params = [];

    if (category && category !== 'All Collections') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (vastu && vastu !== 'all') {
      sql += ' AND (vastu LIKE ? OR vastu_benefit LIKE ?)';
      params.push(`%${vastu}%`, `%${vastu}%`);
    }

    if (minPrice) {
      sql += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      sql += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }

    if (featured === 'true' || featured === '1') {
      sql += ' AND featured = 1';
    }

    if (search) {
      sql += ' AND (title LIKE ? OR subtitle LIKE ? OR description LIKE ? OR material LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    // Sorting
    if (sort === 'price-low') {
      sql += ' ORDER BY price ASC';
    } else if (sort === 'price-high') {
      sql += ' ORDER BY price DESC';
    } else if (sort === 'rating') {
      sql += ' ORDER BY rating DESC, reviews_count DESC';
    } else if (sort === 'popularity') {
      sql += ' ORDER BY reviews_count DESC, rating DESC';
    } else {
      // Default: featured first, then id
      sql += ' ORDER BY featured DESC, price DESC';
    }

    const products = db.query(sql, params).map((p) => ({
      ...p,
      images: p.images_json ? JSON.parse(p.images_json) : [p.image],
    }));

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve products' });
  }
}
