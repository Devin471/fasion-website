const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// ═════════════════════════════════════════════════════════════════════════
// IMPORTS
// ═════════════════════════════════════════════════════════════════════════

const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const sellerRoutes = require('./routes/seller');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const uploadRoutes = require('./routes/upload');

// ═════════════════════════════════════════════════════════════════════════
// APP INITIALIZATION
// ═════════════════════════════════════════════════════════════════════════

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ═════════════════════════════════════════════════════════════════════════
// ENSURE UPLOADS DIRECTORY EXISTS
// ═════════════════════════════════════════════════════════════════════════

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`✅ Uploads directory created: ${uploadsDir}`);
}

// ═════════════════════════════════════════════════════════════════════════
// MIDDLEWARE - PARSING & CORS
// ═════════════════════════════════════════════════════════════════════════

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,
  'https://fasion-website-git-main-devin471s-projects.vercel.app', // Vercel
  'https://myfashion12.netlify.app',  // Netlify
  'http://localhost:3000/'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// ═════════════════════════════════════════════════════════════════════════
// LOGGING MIDDLEWARE
// ═════════════════════════════════════════════════════════════════════════

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ═════════════════════════════════════════════════════════════════════════
// HEALTH CHECK ENDPOINT
// ═════════════════════════════════════════════════════════════════════════

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'myfashion-backend',
    version: '2.0.0',
    database: 'mongodb',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// ═════════════════════════════════════════════════════════════════════════
// API ROUTES
// ═════════════════════════════════════════════════════════════════════════

// Authentication Routes: login, signup, Google Auth
app.use('/api/auth', authRoutes);

// User Routes: profile, addresses, tickets
app.use('/api/users', userRoutes);

// Product Routes: all products, create, update, delete
app.use('/api/products', productRoutes);

// Category Routes: get, create, update, delete
app.use('/api/categories', categoryRoutes);

// Cart Routes: get, add, update, remove
app.use('/api/cart', cartRoutes);

// Wishlist Routes: get, add, remove
app.use('/api/wishlist', wishlistRoutes);

// Order Routes: create, get, status update
app.use('/api/orders', orderRoutes);

// Review Routes: get product reviews, add review
app.use('/api/reviews', reviewRoutes);

// Upload Routes: image upload (multipart)
app.use('/api/upload', uploadRoutes);

// Seller Routes: dashboard, products, profile, analytics
app.use('/api/seller', sellerRoutes);

// Admin Routes: dashboard, users, sellers, products, orders, payments
app.use('/api/admin', adminRoutes);

// ═════════════════════════════════════════════════════════════════════════
// ROOT ENDPOINT
// ═════════════════════════════════════════════════════════════════════════

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to MyFashion Backend API',
    service: 'myfashion-backend',
    version: '2.0.0',
    status: 'running',
    environment: NODE_ENV,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      cart: '/api/cart',
      wishlist: '/api/wishlist',
      orders: '/api/orders',
      reviews: '/api/reviews',
      users: '/api/users',
      seller: '/api/seller',
      admin: '/api/admin'
    },
    timestamp: new Date().toISOString()
  });
});

// ═════════════════════════════════════════════════════════════════════════
// 404 HANDLER - MUST COME AFTER ALL ROUTES
// ═════════════════════════════════════════════════════════════════════════

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// ═════════════════════════════════════════════════════════════════════════
// GLOBAL ERROR HANDLER - MUST BE LAST
// ═════════════════════════════════════════════════════════════════════════

app.use((err, req, res, next) => {
  console.error(`
╔════════════════════════════════════════════════════════════╗
║ ERROR OCCURRED                                             ║
╚════════════════════════════════════════════════════════════╝
Path: ${req.method} ${req.path}
Message: ${err.message}
Stack: ${err.stack}
Timestamp: ${new Date().toISOString()}
  `);

  // Handle Multer errors (file uploads)
  if (err.name === 'MulterError') {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(413).json({
        error: 'File too large. Max size: 5MB',
        code: err.code
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(413).json({
        error: 'Too many files. Max: 10 files',
        code: err.code
      });
    }
    return res.status(400).json({
      error: err.message,
      code: err.code
    });
  }

  // Handle MongoDB Duplicate Key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      error: `${field} already exists`,
      field: field,
      code: err.code
    });
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation failed',
      details: messages
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      details: err.message
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      details: 'Please login again'
    });
  }

  // Generic error response
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ═════════════════════════════════════════════════════════════════════════
// SERVER STARTUP FUNCTION
// ═════════════════════════════════════════════════════════════════════════

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║         🚀 MyFashion Backend Server Started 🚀             ║
╚════════════════════════════════════════════════════════════╝

📍 Server URL:      http://localhost:${PORT}
🌍 Environment:     ${NODE_ENV}
📦 Database:        MongoDB (connected)
📁 Upload Dir:      ${uploadsDir}
⏰ Started At:       ${new Date().toLocaleString()}

Available Endpoints:
  ─ /api/health                (Health check)
  ─ /api/auth                  (Login, Signup, Google Auth)
  ─ /api/users                 (Profile, Addresses, Tickets)
  ─ /api/products              (Browse, Create, Update, Delete)
  ─ /api/categories            (Categories management)
  ─ /api/cart                  (Shopping cart)
  ─ /api/wishlist              (Wishlist)
  ─ /api/orders                (Orders)
  ─ /api/reviews               (Reviews)
  ─ /api/upload                (Image upload)
  ─ /api/seller                (Seller dashboard)
  ─ /api/admin                 (Admin dashboard)

╔════════════════════════════════════════════════════════════╗
║              Server Ready! Accepting Requests               ║
╚════════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\n📛 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n📛 SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error(`
╔════════════════════════════════════════════════════════════╗
║               ❌ Server Startup Failed ❌                  ║
╚════════════════════════════════════════════════════════════╝
Error: ${error.message}
Timestamp: ${new Date().toISOString()}
    `);
    process.exit(1);
  }
};

// ═════════════════════════════════════════════════════════════════════════
// START SERVER
// ═════════════════════════════════════════════════════════════════════════

startServer();
   