/* ─── Seller Routes ────────────────────────────────── */
const router = require('express').Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Seller = require('../models/Seller');
const { verifySeller } = require('../middleware/auth');

/* Dashboard stats */
router.get('/stats', verifySeller, async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const totalProducts = await Product.countDocuments({ seller: sellerId });
    const orders = await Order.find({ 'items.seller': sellerId });
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((s, o) => {
      const sellerItems = o.items.filter(i => i.seller?.toString() === sellerId.toString());
      return s + sellerItems.reduce((ss, i) => ss + i.price * i.quantity, 0);
    }, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    res.json({ totalProducts, totalOrders, totalRevenue, pendingOrders });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Seller's products */
router.get('/products', verifySeller, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.seller._id }).populate('category', 'name').sort('-createdAt');
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Seller's reviews */
router.get('/reviews', verifySeller, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.seller._id }).select('_id');
    const ids = products.map(p => p._id);
    const reviews = await Review.find({ product: { $in: ids } }).populate('user', 'name').populate('product', 'name').sort('-createdAt');
    res.json(reviews);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Seller profile update */
router.put('/profile', verifySeller, async (req, res) => {
  try {
    const fields = ['name', 'businessName', 'description', 'phone', 'address', 'gstNumber', 'bankDetails'];
    fields.forEach(f => { if (req.body[f] !== undefined) req.seller[f] = req.body[f]; });
    await req.seller.save();
    res.json(req.seller);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Seller analytics */
router.get('/analytics', verifySeller, async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const orders = await Order.find({ 'items.seller': sellerId });
    const monthly = {};
    orders.forEach(o => {
      const m = o.createdAt.toISOString().slice(0, 7);
      if (!monthly[m]) monthly[m] = { month: m, revenue: 0, orders: 0 };
      monthly[m].orders++;
      const sellerItems = o.items.filter(i => i.seller?.toString() === sellerId.toString());
      monthly[m].revenue += sellerItems.reduce((s, i) => s + i.price * i.quantity, 0);
    });
    const topProducts = await Product.find({ seller: sellerId }).sort('-sold').limit(5).select('name sold price images');
    res.json({ monthly: Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month)), topProducts });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
