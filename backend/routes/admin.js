/* ─── Admin Routes ─────────────────────────────────── */
const router = require('express').Router();
const User = require('../models/User');
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Payment = require('../models/Payment');
const Ticket = require('../models/Ticket');
const { verifyAdmin } = require('../middleware/auth');

/* Dashboard stats */
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const [totalUsers, totalSellers, pendingSellers, totalProducts, totalOrders, totalCategories] = await Promise.all([
      User.countDocuments(), Seller.countDocuments(), Seller.countDocuments({ status: 'pending' }),
      Product.countDocuments(), Order.countDocuments(), Category.countDocuments()
    ]);
    const revenueAgg = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]);
    const totalRevenue = revenueAgg[0]?.total || 0;
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    res.json({ totalUsers, totalSellers, pendingSellers, totalProducts, totalOrders, totalRevenue, totalCategories, pendingOrders });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Users CRUD */
router.get('/users', verifyAdmin, async (req, res) => {
  try { res.json(await User.find().select('-password').sort('-createdAt')); } catch (err) { res.status(500).json({ error: err.message }); }
});
router.put('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Sellers CRUD */
router.get('/sellers', verifyAdmin, async (req, res) => {
  try { res.json(await Seller.find().select('-password').sort('-createdAt')); } catch (err) { res.status(500).json({ error: err.message }); }
});
router.put('/sellers/:id', verifyAdmin, async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).select('-password');
    if (!seller) return res.status(404).json({ error: 'Seller not found' });
    res.json(seller);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Products */
router.get('/products', verifyAdmin, async (req, res) => {
  try { res.json(await Product.find().populate('seller', 'businessName').populate('category', 'name').sort('-createdAt')); } catch (err) { res.status(500).json({ error: err.message }); }
});
router.put('/products/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.delete('/products/:id', verifyAdmin, async (req, res) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Orders */
router.get('/orders', verifyAdmin, async (req, res) => {
  try { res.json(await Order.find().populate('user', 'name email').sort('-createdAt')); } catch (err) { res.status(500).json({ error: err.message }); }
});
router.put('/orders/:id', verifyAdmin, async (req, res) => {
  try {
    const update = { status: req.body.status };
    if (req.body.status === 'delivered') update.deliveredAt = new Date();
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Payments */
router.get('/payments', verifyAdmin, async (req, res) => {
  try { res.json(await Payment.find().populate('order', 'orderNumber').populate('user', 'name email').sort('-createdAt')); } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Reports */
router.get('/reports', verifyAdmin, async (req, res) => {
  try {
    const monthlyRevenue = await Order.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }, { $project: { month: '$_id', revenue: 1, count: 1, _id: 0 } }
    ]);
    const ordersByStatus = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }, { $project: { status: '$_id', count: 1, _id: 0 } }]);
    const topProducts = await Product.find().sort('-sold').limit(10).select('name sold price images');
    res.json({ monthlyRevenue, ordersByStatus, topProducts });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Tickets */
router.get('/tickets', verifyAdmin, async (req, res) => {
  try { res.json(await Ticket.find().sort('-createdAt')); } catch (err) { res.status(500).json({ error: err.message }); }
});
router.put('/tickets/:id', verifyAdmin, async (req, res) => {
  try { res.json(await Ticket.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })); } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
