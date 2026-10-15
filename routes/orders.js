const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { optionalAuth, authenticateUser, requireStaffOrAdmin } = require('../middleware/auth');

// POST /api/orders — Complete Private Acquisition Checkout
router.post('/orders', optionalAuth, (req, res) => {
  try {
    const { patronName, email, phone, address, items, paymentMethod } = req.body;

    if (!patronName || !email || !phone || !address) {
      return res.status(400).json({ success: false, message: 'Patron name, email, phone, and delivery address are required.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your acquisition bag is empty.' });
    }

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `LUX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingCode = `LX-${Math.floor(100000 + Math.random() * 900000)}-SECURITY`;
    const now = new Date().toISOString();
    const userId = req.user ? req.user.id : null;

    // Calculate subtotal and verify stock
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const prod = db.get('SELECT * FROM products WHERE id = ?', [item.productId || item.id]);
      if (prod) {
        const qty = Math.max(1, parseInt(item.qty, 10) || 1);
        const price = prod.price;
        subtotal += price * qty;
        validatedItems.push({
          productId: prod.id,
          title: prod.title,
          price: price,
          qty: qty,
          image: prod.image
        });

        // Decrement stock
        db.run('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?', [qty, prod.id]);
      }
    }

    if (validatedItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid artifacts found in bag.' });
    }

    // Save Order
    db.run(`
      INSERT INTO orders (
        id, order_number, user_id, patron_name, email, phone, address,
        subtotal, shipping_fee, total, payment_method, payment_status,
        delivery_status, courier, tracking_code, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, 'Processing White-Glove Dispatch', 'Luxignia Private Security Courier', ?, ?, ?)
    `, [
      orderId,
      orderNumber,
      userId,
      patronName.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      address.trim(),
      subtotal,
      subtotal,
      paymentMethod || 'Concierge Wire Transfer',
      `Paid (${paymentMethod || 'Concierge Wire Transfer'})`,
      trackingCode,
      now,
      now
    ]);

    // Save Order Items
    for (const item of validatedItems) {
      db.run(`
        INSERT INTO order_items (id, order_id, product_id, title, price, qty, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [`item-${Date.now()}-${Math.floor(Math.random() * 1000)}`, orderId, item.productId, item.title, item.price, item.qty, item.image]);
    }

    // Automatically record or update high-value lead in CRM
    const existingLead = db.get('SELECT id FROM leads WHERE email = ?', [email.trim().toLowerCase()]);
    if (existingLead) {
      db.run(`
        UPDATE leads SET
          status = 'Won',
          budget = '$' || ?,
          interest = 'Acquired: ' || ?,
          updated_at = ?
        WHERE id = ?
      `, [subtotal.toLocaleString(), orderNumber, now, existingLead.id]);
    } else {
      const leadId = `lead-${Date.now()}`;
      db.run(`
        INSERT INTO leads (
          id, customer_name, email, phone, company, source, interest, budget,
          status, vastu_required, assigned_concierge, priority, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, 'Private Collector', 'E-Commerce Checkout', ?, ?, 'Won', 1, 'Senior Curator', 'VIP', ?, ?, ?)
      `, [
        leadId,
        patronName.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        `Order #${orderNumber} (${validatedItems.map(i => i.title).join(', ')})`,
        `$${subtotal.toLocaleString()}`,
        `VIP Patron completed high-value acquisition. Arrange white-glove security delivery and directional positioning.`,
        now,
        now
      ]);
    }

    // Notification for Admin / Staff
    db.run(`
      INSERT INTO notifications (id, user_id, role_target, title, message, type, is_read, link, created_at)
      VALUES (?, NULL, 'admin', 'High-Value Acquisition Placed', ?, 'order', 0, '/admin#orders', ?)
    `, [`notif-ord-${Date.now()}`, `Order #${orderNumber} ($${subtotal.toLocaleString()}) by ${patronName.trim()}`, now]);

    // Notification for Customer
    if (userId) {
      db.run(`
        INSERT INTO notifications (id, user_id, role_target, title, message, type, is_read, link, created_at)
        VALUES (?, ?, 'customer', 'Acquisition Confirmed', ?, 'order', 0, '/dashboard#orders', ?)
      `, [`notif-user-ord-${Date.now()}`, userId, `Order #${orderNumber} confirmed. White-glove logistics initiated.`, now]);
    }

    // Log Activity
    db.run(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, 'ORDER_CREATED', 'orders', ?, ?, ?, ?)
    `, [`act-${Date.now()}`, userId, patronName.trim(), orderId, `Acquisition #${orderNumber} ($${subtotal.toLocaleString()})`, req.ip || '127.0.0.1', now]);

    const createdOrder = db.get('SELECT * FROM orders WHERE id = ?', [orderId]);

    res.status(201).json({
      success: true,
      message: 'Private acquisition placed successfully.',
      order: {
        ...createdOrder,
        orderNumber: createdOrder.order_number,
        patronName: createdOrder.patron_name,
        paymentStatus: createdOrder.payment_status,
        deliveryStatus: createdOrder.delivery_status,
        trackingCode: createdOrder.tracking_code,
        items: validatedItems
      }
    });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ success: false, message: 'Server error processing acquisition checkout.' });
  }
});

// GET /api/orders — List orders (Staff/Admin sees all, Customer sees their own)
router.get('/orders', authenticateUser, (req, res) => {
  try {
    const isStaffOrAdmin = ['staff', 'admin', 'super_admin'].includes(req.user.role);

    let sql = 'SELECT * FROM orders';
    const params = [];

    if (!isStaffOrAdmin) {
      sql += ' WHERE user_id = ? OR email = ?';
      params.push(req.user.id, req.user.email);
    } else {
      const { deliveryStatus, search } = req.query;
      sql += ' WHERE 1=1';
      if (deliveryStatus && deliveryStatus !== 'All') {
        sql += ' AND LOWER(delivery_status) = LOWER(?)';
        params.push(deliveryStatus);
      }
      if (search) {
        sql += ' AND (LOWER(order_number) LIKE LOWER(?) OR LOWER(patron_name) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?) OR LOWER(tracking_code) LIKE LOWER(?))';
        const q = `%${search.trim()}%`;
        params.push(q, q, q, q);
      }
    }

    sql += ' ORDER BY created_at DESC';

    const orders = db.query(sql, params).map(order => {
      const items = db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      return {
        ...order,
        patronName: order.patron_name,
        orderNumber: order.order_number,
        paymentStatus: order.payment_status,
        deliveryStatus: order.delivery_status,
        trackingCode: order.tracking_code,
        createdAt: order.created_at,
        items
      };
    });

    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
  }
});

// GET /api/orders/:id — Single order details
router.get('/orders/:id', authenticateUser, (req, res) => {
  try {
    const order = db.get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    const isStaffOrAdmin = ['staff', 'admin', 'super_admin'].includes(req.user.role);
    if (!isStaffOrAdmin && order.user_id !== req.user.id && order.email !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const items = db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);

    res.json({
      success: true,
      order: {
        ...order,
        patronName: order.patron_name,
        orderNumber: order.order_number,
        paymentStatus: order.payment_status,
        deliveryStatus: order.delivery_status,
        trackingCode: order.tracking_code,
        createdAt: order.created_at,
        items
      }
    });
  } catch (err) {
    console.error('Error retrieving order:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve order details.' });
  }
});

// PUT /api/orders/:id/status — Update delivery / payment status (Staff / Admin)
router.put('/orders/:id/status', requireStaffOrAdmin, (req, res) => {
  try {
    const order = db.get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    const { deliveryStatus, paymentStatus, courier, trackingCode } = req.body;
    const now = new Date().toISOString();

    db.run(`
      UPDATE orders SET
        delivery_status = COALESCE(?, delivery_status),
        payment_status = COALESCE(?, payment_status),
        courier = COALESCE(?, courier),
        tracking_code = COALESCE(?, tracking_code),
        updated_at = ?
      WHERE id = ?
    `, [deliveryStatus, paymentStatus, courier, trackingCode, now, req.params.id]);

    // Notify customer if user_id present
    if (order.user_id && deliveryStatus) {
      db.run(`
        INSERT INTO notifications (id, user_id, role_target, title, message, type, is_read, link, created_at)
        VALUES (?, ?, 'customer', 'Logistics Status Update', ?, 'order', 0, '/dashboard#orders', ?)
      `, [`notif-${Date.now()}`, order.user_id, `Order #${order.order_number} status updated to: ${deliveryStatus}`, now]);
    }

    // Log Activity
    db.run(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, 'ORDER_STATUS_UPDATED', 'orders', ?, ?, ?, ?)
    `, [`act-${Date.now()}`, req.user.id, req.user.name, req.params.id, `Order #${order.order_number} status: ${deliveryStatus || order.delivery_status}`, req.ip || '127.0.0.1', now]);

    const updated = db.get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    res.json({ success: true, order: updated });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
});

module.exports = router;
