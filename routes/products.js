const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { requireStaffOrAdmin, requireAdmin } = require('../middleware/auth');

// GET /api/products — Search, Filter, Sort, Pagination
router.get('/products', (req, res) => {
  try {
    const { category, vastu, search, sort, minPrice, maxPrice, page = 1, limit = 50 } = req.query;

    let sql = 'SELECT * FROM products WHERE is_published = 1';
    const params = [];

    if (category && category !== 'All') {
      sql += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (vastu) {
      sql += ' AND LOWER(vastu) LIKE LOWER(?)';
      params.push(`%${vastu}%`);
    }

    if (search) {
      sql += ' AND (LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?) OR LOWER(badge) LIKE LOWER(?) OR LOWER(material) LIKE LOWER(?))';
      const q = `%${search.trim()}%`;
      params.push(q, q, q, q);
    }

    if (minPrice) {
      sql += ' AND price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      sql += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        sql += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        sql += ' ORDER BY price DESC';
        break;
      case 'rating':
        sql += ' ORDER BY rating DESC';
        break;
      case 'newest':
        sql += ' ORDER BY created_at DESC';
        break;
      default:
        sql += ' ORDER BY featured DESC, created_at DESC';
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const offset = (pageNum - 1) * limitNum;

    const countSql = sql.replace('SELECT * FROM products', 'SELECT COUNT(*) as total FROM products');
    const totalRow = db.get(countSql, params);
    const total = totalRow ? totalRow.total : 0;

    sql += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const products = db.query(sql, params).map(p => {
      let images = [];
      try {
        images = p.images_json ? JSON.parse(p.images_json) : [p.image];
      } catch (e) { images = [p.image]; }
      return { ...p, images };
    });

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving products.' });
  }
});

// GET /api/products/:id — Single product detail + related artifacts
router.get('/products/:id', (req, res) => {
  try {
    const product = db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Artifact not found in archive.' });
    }

    let images = [];
    try {
      images = product.images_json ? JSON.parse(product.images_json) : [product.image];
    } catch (e) { images = [product.image]; }

    // Fetch related products in the same category
    const related = db.query(
      'SELECT id, title, subtitle, category, price, rating, image, badge FROM products WHERE category = ? AND id != ? LIMIT 3',
      [product.category, product.id]
    );

    res.json({
      success: true,
      product: { ...product, images },
      related
    });
  } catch (err) {
    console.error('Error retrieving product:', err);
    res.status(500).json({ success: false, message: 'Error retrieving artifact details.' });
  }
});

// POST /api/products — Create artifact (Staff / Admin)
router.post('/products', requireStaffOrAdmin, (req, res) => {
  try {
    const {
      title, subtitle, category, category_id, price, stock, sku,
      vastu, vastu_benefit, material, dimensions, weight, model3d_id,
      image, images, featured, badge, description
    } = req.body;

    if (!title || !price) {
      return res.status(400).json({ success: false, message: 'Artifact title and price are required.' });
    }

    const id = `prod-${Date.now()}`;
    const generatedSku = sku || `LUX-${(category || 'ART').substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();
    const primaryImage = image || (images && images[0]) || '/images/products/Elegant Horse Sculpture in Warm Interior.png';
    const imagesJson = JSON.stringify(images || [primaryImage]);

    db.run(`
      INSERT INTO products (
        id, title, subtitle, category, category_id, price, stock, sku, rating, reviews_count,
        vastu, vastu_benefit, material, dimensions, weight, model3d_id, image, images_json,
        featured, badge, description, is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 5.0, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `, [
      id,
      title.trim(),
      subtitle || 'Artisanal Luxury Masterpiece',
      category || 'Sculptures',
      category_id || null,
      Number(price),
      Number(stock) || 1,
      generatedSku,
      vastu || 'North-East (Kubera Zone)',
      vastu_benefit || 'Energy Harmonization & Abundance',
      material || 'Hand-gilded Brass & Marble',
      dimensions || '35cm × 25cm × 45cm',
      weight || '12 kg',
      model3d_id || 'aurelius',
      primaryImage,
      imagesJson,
      featured ? 1 : 0,
      badge || 'New Artifact',
      description || 'Bespoke hand-crafted luxury decor statement piece.',
      now,
      now
    ]);

    // Log Activity
    db.run(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, 'PRODUCT_CREATED', 'products', ?, ?, ?, ?)
    `, [`act-${Date.now()}`, req.user.id, req.user.name, id, `Added artifact: ${title} ($${price})`, req.ip || '127.0.0.1', now]);

    const created = db.get('SELECT * FROM products WHERE id = ?', [id]);
    res.status(201).json({ success: true, product: created });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, message: 'Server error while cataloging artifact.' });
  }
});

// PUT /api/products/:id — Update artifact (Staff / Admin)
router.put('/products/:id', requireStaffOrAdmin, (req, res) => {
  try {
    const existing = db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Artifact not found.' });
    }

    const {
      title, subtitle, category, category_id, price, stock, sku,
      vastu, vastu_benefit, material, dimensions, weight, model3d_id,
      image, images, featured, badge, description, is_published
    } = req.body;

    const now = new Date().toISOString();
    const primaryImage = image || existing.image;
    const imagesJson = images ? JSON.stringify(images) : existing.images_json;

    db.run(`
      UPDATE products SET
        title = ?, subtitle = ?, category = ?, category_id = ?, price = ?, stock = ?, sku = ?,
        vastu = ?, vastu_benefit = ?, material = ?, dimensions = ?, weight = ?, model3d_id = ?,
        image = ?, images_json = ?, featured = ?, badge = ?, description = ?, is_published = ?,
        updated_at = ?
      WHERE id = ?
    `, [
      title !== undefined ? title : existing.title,
      subtitle !== undefined ? subtitle : existing.subtitle,
      category !== undefined ? category : existing.category,
      category_id !== undefined ? category_id : existing.category_id,
      price !== undefined ? Number(price) : existing.price,
      stock !== undefined ? Number(stock) : existing.stock,
      sku !== undefined ? sku : existing.sku,
      vastu !== undefined ? vastu : existing.vastu,
      vastu_benefit !== undefined ? vastu_benefit : existing.vastu_benefit,
      material !== undefined ? material : existing.material,
      dimensions !== undefined ? dimensions : existing.dimensions,
      weight !== undefined ? weight : existing.weight,
      model3d_id !== undefined ? model3d_id : existing.model3d_id,
      primaryImage,
      imagesJson,
      featured !== undefined ? (featured ? 1 : 0) : existing.featured,
      badge !== undefined ? badge : existing.badge,
      description !== undefined ? description : existing.description,
      is_published !== undefined ? (is_published ? 1 : 0) : existing.is_published,
      now,
      req.params.id
    ]);

    // Log Activity
    db.run(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, 'PRODUCT_UPDATED', 'products', ?, ?, ?, ?)
    `, [`act-${Date.now()}`, req.user.id, req.user.name, req.params.id, `Updated artifact: ${title || existing.title}`, req.ip || '127.0.0.1', now]);

    const updated = db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, product: updated });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: 'Server error updating artifact.' });
  }
});

// DELETE /api/products/:id — Delete artifact (Admin only)
router.delete('/products/:id', requireAdmin, (req, res) => {
  try {
    const existing = db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Artifact not found.' });
    }

    db.run('DELETE FROM products WHERE id = ?', [req.params.id]);

    const now = new Date().toISOString();
    db.run(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, 'PRODUCT_DELETED', 'products', ?, ?, ?, ?)
    `, [`act-${Date.now()}`, req.user.id, req.user.name, req.params.id, `Deleted artifact: ${existing.title}`, req.ip || '127.0.0.1', now]);

    res.json({ success: true, message: 'Artifact removed from catalog.' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, message: 'Failed to delete artifact.' });
  }
});

// GET /api/categories — List all categories
router.get('/categories', (req, res) => {
  try {
    const categories = db.query('SELECT * FROM categories WHERE is_active = 1 ORDER BY display_order ASC');
    res.json({ success: true, categories });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving categories.' });
  }
});

// POST /api/categories — Create category (Admin)
router.post('/categories', requireAdmin, (req, res) => {
  try {
    const { name, description, image, display_order } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required.' });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `cat-${Date.now()}`;

    db.run(`
      INSERT INTO categories (id, name, slug, description, image, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [id, name.trim(), slug, description || '', image || '', Number(display_order) || 0]);

    res.status(201).json({ success: true, category: { id, name, slug } });
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
});

// DELETE /api/categories/:id — Delete category (Admin)
router.delete('/categories/:id', requireAdmin, (req, res) => {
  try {
    db.run('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Category removed.' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
});

module.exports = router;
