/* ─── Wishlist Routes ──────────────────────────────── */
const router = require('express').Router();
const Wishlist = require('../models/Wishlist');
const { verifyCustomer } = require('../middleware/auth');

router.get('/', verifyCustomer, async (req, res) => {
  try {
    let wl = await Wishlist.findOne({ user: req.user.id }).populate('products');
    if (!wl) wl = { products: [] };
    res.json(wl);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', verifyCustomer, async (req, res) => {
  try {
    let wl = await Wishlist.findOne({ user: req.user.id });
    if (!wl) wl = new Wishlist({ user: req.user.id, products: [] });
    if (!wl.products.some(p => p.toString() === req.body.productId)) wl.products.push(req.body.productId);
    await wl.save();
    wl = await Wishlist.findOne({ user: req.user.id }).populate('products');
    res.json(wl);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:productId', verifyCustomer, async (req, res) => {
  try {
    const wl = await Wishlist.findOne({ user: req.user.id });
    if (wl) { wl.products = wl.products.filter(p => p.toString() !== req.params.productId); await wl.save(); }
    const updated = await Wishlist.findOne({ user: req.user.id }).populate('products');
    res.json(updated || { products: [] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
