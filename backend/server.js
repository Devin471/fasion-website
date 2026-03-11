/* ═══════════════════════════════════════════════════════
   ShopKart — Multi-Vendor E-Commerce API Server
   ═══════════════════════════════════════════════════════ */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

/* ── Connect MongoDB ── */
connectDB();

/* ── Middleware ── */
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ── API Routes ── */
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart',       require('./routes/cart'));
app.use('/api/wishlist',   require('./routes/wishlist'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/reviews',    require('./routes/reviews'));
app.use('/api/seller',     require('./routes/seller'));
app.use('/api/admin',      require('./routes/admin'));
app.use('/api/users',      require('./routes/users'));
app.use('/api/upload',     require('./routes/upload'));

/* ── Health check ── */
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

/* ── Start ── */
app.listen(PORT, () => console.log(`🚀 ShopKart API running on port ${PORT}`));
