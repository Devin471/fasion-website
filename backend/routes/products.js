/* ─── Product Routes ───────────────────────────────── */
const router = require('express').Router();
const Product = require('../models/Product');
const { verifySeller } = require('../middleware/auth');

/* Public: get all products with filters */
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, rating, sort, page = 1, limit = 20, featured, brand } = req.query;
    const filter = { isActive: true, isApproved: true };
    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (search) filter.$text = { $search: search };
    if (minPrice || maxPrice) { filter.price = {}; if (minPrice) filter.price.$gte = +minPrice; if (maxPrice) filter.price.$lte = +maxPrice; }
    if (rating) filter.rating = { $gte: +rating };
    if (featured === 'true') filter.isFeatured = true;

    let sortOpt = { createdAt: -1 };
    if (sort === 'price_asc') sortOpt = { price: 1 };
    else if (sort === 'price_desc') sortOpt = { price: -1 };
    else if (sort === 'rating') sortOpt = { rating: -1 };
    else if (sort === 'popular') sortOpt = { sold: -1 };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('seller', 'businessName')
      .sort(sortOpt)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.json({ products, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Public: single product */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('seller', 'businessName rating');
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Seller: create */
router.post('/', verifySeller, async (req, res) => {
  try {
    if (req.seller.status !== 'approved') return res.status(403).json({ error: 'Seller not approved' });
    const product = await Product.create({ ...req.body, seller: req.seller._id });
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Seller: update */
router.put('/:id', verifySeller, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller: req.seller._id });
    if (!product) return res.status(404).json({ error: 'Not found' });
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Seller: delete */
router.delete('/:id', verifySeller, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.seller._id });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
