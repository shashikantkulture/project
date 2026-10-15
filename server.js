const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Initialize Database & Seeds
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Parsing Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve product images from public/images/products and fallback to d:\DOWNLOADS\luxignia if needed
const localImagesPath = path.join(__dirname, 'public', 'images', 'products');
app.use('/images/products', express.static(localImagesPath));
if (fs.existsSync('d:/DOWNLOADS/luxignia')) {
  app.use('/images/products-raw', express.static('d:/DOWNLOADS/luxignia'));
}

// REST API Routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/products'));
app.use('/api', require('./routes/leads'));
app.use('/api', require('./routes/enquiries'));
app.use('/api', require('./routes/orders'));
app.use('/api', require('./routes/customers'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/analytics'));
app.use('/api', require('./routes/visits'));
app.use('/api', require('./routes/favorites'));
app.use('/api', require('./routes/notifications'));
app.use('/api', require('./routes/content'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Luxignia Artisanal E-Commerce & CRM'
  });
});

// Single Page Application (SPA) Fallback Route
app.get('*', (req, res) => {
  // If API route not found
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found.' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred. Our curatorial engineering desk has been notified.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✨ Luxignia Luxury Artisanal E-Commerce & CRM is live on http://localhost:${PORT}`);
});

module.exports = app;
