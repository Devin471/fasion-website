/* ─── Auth Routes ──────────────────────────────────── */
const router = require('express').Router();
const User = require('../models/User');
const Seller = require('../models/Seller');
const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');

function randomPassword() {
  return `g_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

/* ── Customer ── */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ error: 'Email already registered' });
    const user = await User.create({ name, email, password, phone });
    res.status(201).json({ token: generateToken(user._id, 'customer'), user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.isActive) return res.status(403).json({ error: 'Account deactivated' });
    res.json({ token: generateToken(user._id, 'customer'), user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── Seller ── */
router.post('/seller/register', async (req, res) => {
  try {
    const { name, email, password, businessName, description, phone, address, gstNumber } = req.body;
    if (await Seller.findOne({ email })) return res.status(400).json({ error: 'Email already registered' });
    const seller = await Seller.create({ name, email, password, businessName, description, phone, address, gstNumber });
    res.status(201).json({ token: generateToken(seller._id, 'seller'), seller: { id: seller._id, name: seller.name, email: seller.email, businessName: seller.businessName, status: seller.status } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/seller/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller || !(await seller.matchPassword(password))) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ token: generateToken(seller._id, 'seller'), seller: { id: seller._id, name: seller.name, email: seller.email, businessName: seller.businessName, status: seller.status } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── Admin ── */
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ token: generateToken(admin._id, 'admin'), admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/admin/register', async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) return res.status(403).json({ error: 'Admin already exists' });
    const { name, email, password } = req.body;
    const admin = await Admin.create({ name, email, password });
    res.status(201).json({ token: generateToken(admin._id, 'admin'), admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ── Google Auth (Customer/Seller) ── */
router.post('/google', async (req, res) => {
  try {
    const { accessToken, role = 'customer' } = req.body;
    if (!accessToken) return res.status(400).json({ error: 'Google access token is required' });
    if (!['customer', 'seller'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!googleRes.ok) return res.status(401).json({ error: 'Invalid Google token' });
    const profile = await googleRes.json();

    if (!profile?.email || profile?.email_verified === false) {
      return res.status(400).json({ error: 'Google account email is not verified' });
    }

    if (role === 'seller') {
      let seller = await Seller.findOne({ email: profile.email.toLowerCase() });
      if (!seller) {
        seller = await Seller.create({
          name: profile.name || 'Seller',
          email: profile.email.toLowerCase(),
          password: randomPassword(),
          businessName: `${profile.name || 'Seller'} Store`,
          description: 'Registered with Google',
          status: 'approved'
        });
      }
      return res.json({
        token: generateToken(seller._id, 'seller'),
        seller: { id: seller._id, name: seller.name, email: seller.email, businessName: seller.businessName, status: seller.status }
      });
    }

    let user = await User.findOne({ email: profile.email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name: profile.name || 'Customer',
        email: profile.email.toLowerCase(),
        password: randomPassword(),
        avatar: profile.picture || ''
      });
    }

    if (!user.isActive) return res.status(403).json({ error: 'Account deactivated' });

    return res.json({
      token: generateToken(user._id, 'customer'),
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
