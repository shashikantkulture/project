const db = require('../../db/database');
const { getUserFromRequest } = require('../../lib/authHelper');

export default async function handler(req, res) {
  const user = getUserFromRequest(req);

  if (req.method === 'GET') {
    try {
      let orders;
      if (user && ['super_admin', 'admin', 'staff'].includes(user.role)) {
        orders = db.query('SELECT * FROM orders ORDER BY created_at DESC');
      } else if (user) {
        orders = db.query('SELECT * FROM orders WHERE user_id = ? OR email = ? ORDER BY created_at DESC', [
          user.id,
          user.email,
        ]);
      } else {
        // Return public recent demo order or empty
        orders = db.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5');
      }

      // Attach order items
      const enriched = orders.map((o) => {
        const items = db.query('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
        return { ...o, items };
      });

      return res.status(200).json({ success: true, orders: enriched });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { patronName, email, phone, address, paymentMethod, items, specialInstructions } = req.body;
      if (!patronName || !email || !items || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Missing acquisition order details' });
      }

      const orderId = `ord-${Date.now()}`;
      const orderNumber = `LUX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const subtotal = items.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
      const total = subtotal;
      const now = new Date().toISOString();

      db.run(
        `INSERT INTO orders (
          id, order_number, user_id, patron_name, email, phone, address,
          subtotal, shipping_fee, total, payment_method, payment_status,
          delivery_status, courier, tracking_code, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          orderNumber,
          user ? user.id : null,
          patronName,
          email,
          phone || '',
          address || '',
          subtotal,
          total,
          paymentMethod || 'Concierge Wire Transfer',
          'Confirmed (White-Glove Escrow)',
          'Processing White-Glove Dispatch',
          'Luxignia Armored Security Courier',
          `LX-${Math.floor(100000 + Math.random() * 900000)}-SEC`,
          now,
          now,
        ]
      );

      // Insert Items
      const insertItem = db.db.prepare(`
        INSERT INTO order_items (id, order_id, product_id, title, price, qty, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of items) {
        insertItem.run(
          `oi-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          orderId,
          item.productId,
          item.title,
          item.price,
          item.qty || 1,
          item.image || ''
        );
      }

      // Notify Admin
      db.run(
        `INSERT INTO notifications (id, user_id, role_target, title, message, type, is_read, link, created_at)
         VALUES (?, NULL, 'admin', 'High-Value Acquisition Registered', ?, 'order', 0, '/admin#orders', ?)`,
        [`notif-${Date.now()}`, `Order ${orderNumber} placed by ${patronName} ($${total.toLocaleString()})`, now]
      );

      // Register Lead if not already registered
      db.run(
        `INSERT INTO leads (
          id, customer_name, email, phone, company, source, interest, budget,
          status, vastu_required, assigned_concierge, priority, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, '', 'Online Acquisition', ?, ?, 'Qualified', 1, 'Senior Curator', 'VIP', ?, ?, ?)`,
        [
          `lead-${Date.now()}`,
          patronName,
          email,
          phone || '',
          `Acquired: ${items.map((i) => i.title).join(', ')}`,
          `$${total.toLocaleString()}`,
          specialInstructions || 'White-glove placement requested',
          now,
          now,
        ]
      );

      return res.status(201).json({
        success: true,
        order: {
          id: orderId,
          orderNumber,
          order_number: orderNumber,
          patronName,
          email,
          total,
          status: 'Processing White-Glove Dispatch',
        },
      });
    } catch (e) {
      console.error('Error creating order:', e);
      return res.status(500).json({ success: false, error: 'Failed to process acquisition' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
