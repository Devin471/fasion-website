/* ─── JWT Auth Middleware ───────────────────────────── */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Seller = require('../models/Seller');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'shopkart-secret-2026';

const generateToken = (id, role) => jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });

/* Generic token verifier */
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch { return res.status(401).json({ error: 'Invalid token' }); }
};

/* Role-specific guards */
const verifyCustomer = async (req, res, next) => {
  verifyToken(req, res, async () => {
    if (req.user.role !== 'customer') return res.status(403).json({ error: 'Customer access only' });
    const user = await User.findById(req.user.id);
    if (!user || !user.isActive) return res.status(403).json({ error: 'Account not active' });
    req.customer = user;
    next();
  });
};

const verifySeller = async (req, res, next) => {
  verifyToken(req, res, async () => {
    if (req.user.role !== 'seller') return res.status(403).json({ error: 'Seller access only' });
    const seller = await Seller.findById(req.user.id);
    if (!seller) return res.status(403).json({ error: 'Seller not found' });
    req.seller = seller;
    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  verifyToken(req, res, async () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(403).json({ error: 'Admin not found' });
    req.admin = admin;
    next();
  });
};

module.exports = { generateToken, verifyToken, verifyCustomer, verifySeller, verifyAdmin };
