/* ─── Review Routes ────────────────────────────────── */
const router = require('express').Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { verifyCustomer } = require('../middleware/auth');

/* Get reviews for product */
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name').sort('-createdAt');
    res.json(reviews);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Add review */
router.post('/', verifyCustomer, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const existing = await Review.findOne({ product: productId, user: req.user.id });
    if (existing) return res.status(400).json({ error: 'Already reviewed' });
    const review = await Review.create({ product: productId, user: req.user.id, rating, title, comment });
    /* Update product rating */
    const reviews = await Review.find({ product: productId });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: Math.round(avg * 10) / 10, numReviews: reviews.length });
    res.status(201).json(review);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
