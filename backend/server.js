const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Database setup
const dbPath = path.join(__dirname, 'fashion_store.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database error:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database
const initializeDatabase = () => {
  db.serialize(() => {
    // Admins table
    db.run(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Customers table
    db.run(`CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Designs table
    db.run(`CREATE TABLE IF NOT EXISTS designs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      price REAL NOT NULL,
      stock INTEGER,
      image_url TEXT,
      images TEXT,
      material TEXT,
      size_info TEXT,
      care_instructions TEXT,
      designer_name TEXT,
      designer_bio TEXT,
      designer_photo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run('ALTER TABLE designs ADD COLUMN designer_name TEXT', () => {});
    db.run('ALTER TABLE designs ADD COLUMN designer_bio TEXT', () => {});
    db.run('ALTER TABLE designs ADD COLUMN designer_photo_url TEXT', () => {});
    db.run('ALTER TABLE designs ADD COLUMN images TEXT', () => {});
    db.run('ALTER TABLE designs ADD COLUMN material TEXT', () => {});
    db.run('ALTER TABLE designs ADD COLUMN size_info TEXT', () => {});
    db.run('ALTER TABLE designs ADD COLUMN care_instructions TEXT', () => {});

    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      total_price REAL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Order items table
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      design_id INTEGER,
      quantity INTEGER,
      price REAL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (design_id) REFERENCES designs(id)
    )`);
  });
};

const checkAdminExists = (callback) => {
  db.get("SELECT COUNT(*) as count FROM admins", (err, result) => {
    if (err) {
      return callback(err, false);
    }
    callback(null, result.count > 0);
  });
};

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.adminId = decoded.id;
    next();
  });
};

// ==================== AUTH ROUTES ====================

app.get('/api/admin/exists', (req, res) => {
  checkAdminExists((err, exists) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ exists });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM admins WHERE email = ?", [email], (err, admin) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  checkAdminExists((err, exists) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    if (exists) {
      return res.status(403).json({ error: 'Admin already exists' });
    }

    db.run("INSERT INTO admins (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(201).json({ message: 'Admin registered successfully' });
      }
    );
  });
});

// ==================== CUSTOMER AUTH ROUTES ====================

app.post('/api/customers/register', (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run("INSERT INTO customers (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    function(err) {
      if (err) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      const token = jwt.sign({ id: this.lastID, role: 'customer' }, JWT_SECRET, { expiresIn: '24h' });
      res.status(201).json({ token, message: 'Customer registered successfully' });
    }
  );
});

app.post('/api/customers/login', (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM customers WHERE email = ?", [email], (err, customer) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }

    if (!customer || !bcrypt.compareSync(password, customer.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: customer.id, role: 'customer' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  });
});

// ==================== DESIGN ROUTES ====================

// Upload images endpoint
app.post('/api/upload', verifyToken, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ urls: fileUrls });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.get('/api/designs', (req, res) => {
  db.all("SELECT * FROM designs ORDER BY created_at DESC", (err, designs) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(designs);
  });
});

app.get('/api/designs/:id', (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM designs WHERE id = ?", [id], (err, design) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }
    res.json(design);
  });
});

app.post('/api/designs', verifyToken, (req, res) => {
  const {
    name,
    description,
    category,
    price,
    stock,
    image_url,
    images,
    material,
    size_info,
    care_instructions,
    designer_name,
    designer_bio,
    designer_photo_url
  } = req.body;

  const imagesJson = images ? JSON.stringify(images) : null;

  db.run(
    `INSERT INTO designs (name, description, category, price, stock, image_url, images, material, size_info, care_instructions, designer_name, designer_bio, designer_photo_url) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, description, category, price, stock, image_url, imagesJson, material, size_info, care_instructions, designer_name, designer_bio, designer_photo_url],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.status(201).json({ id: this.lastID, message: 'Design added successfully' });
    }
  );
});

app.put('/api/designs/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    category,
    price,
    stock,
    image_url,
    images,
    material,
    size_info,
    care_instructions,
    designer_name,
    designer_bio,
    designer_photo_url
  } = req.body;

  const imagesJson = images ? JSON.stringify(images) : null;

  db.run(
    `UPDATE designs SET name = ?, description = ?, category = ?, price = ?, stock = ?, image_url = ?, images = ?, material = ?, size_info = ?, care_instructions = ?, designer_name = ?, designer_bio = ?, designer_photo_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [name, description, category, price, stock, image_url, imagesJson, material, size_info, care_instructions, designer_name, designer_bio, designer_photo_url, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ message: 'Design updated successfully' });
    }
  );
});

app.delete('/api/designs/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM designs WHERE id = ?", [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ message: 'Design deleted successfully' });
  });
});

// ==================== ORDER ROUTES ====================

app.get('/api/orders', (req, res) => {
  db.all("SELECT * FROM orders ORDER BY created_at DESC", (err, orders) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(orders);
  });
});

app.post('/api/orders', (req, res) => {
  const { customer_name, customer_email, total_price, items } = req.body;

  db.run(
    "INSERT INTO orders (customer_name, customer_email, total_price, status) VALUES (?, ?, ?, 'pending')",
    [customer_name, customer_email, total_price],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      const orderId = this.lastID;

      // Add order items
      if (items && items.length > 0) {
        items.forEach(item => {
          db.run(
            "INSERT INTO order_items (order_id, design_id, quantity, price) VALUES (?, ?, ?, ?)",
            [orderId, item.design_id, item.quantity, item.price]
          );
        });
      }

      res.status(201).json({ id: orderId, message: 'Order created successfully' });
    }
  );
});

app.put('/api/orders/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.run("UPDATE orders SET status = ? WHERE id = ?", [status, id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ message: 'Order status updated' });
  });
});

// ==================== STATS ROUTE ====================

app.get('/api/stats', verifyToken, (req, res) => {
  let stats = {};

  db.get("SELECT COUNT(*) as count FROM designs", (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    stats.total_designs = result.count;

    db.get("SELECT COUNT(*) as count FROM orders", (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      stats.total_orders = result.count;

      db.get("SELECT COALESCE(SUM(total_price), 0) as total FROM orders", (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Server error' });
        }
        stats.total_revenue = result.total;
        res.json(stats);
      });
    });
  });
});

// ==================== ERROR HANDLERS ====================

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

// ==================== START SERVER ====================

initializeDatabase();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Database: ${dbPath}`);
  });
}

module.exports = app;
