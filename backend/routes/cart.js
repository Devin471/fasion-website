/* ─── Cart Routes ──────────────────────────────────── */
const router = require('express').Router();
const Cart = require('../models/Cart');
const { verifyCustomer } = require('../middleware/auth');

/* Get cart */
router.get('/', verifyCustomer, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) cart = { items: [] };
    res.json(cart);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Add / update item */
router.post('/', verifyCustomer, async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });
    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx > -1) { cart.items[idx].quantity = quantity; }
    else { cart.items.push({ product: productId, quantity, size, color }); }
    await cart.save();
    cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(cart);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Update quantity */
router.put('/:itemId', verifyCustomer, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found in cart' });
    item.quantity = req.body.quantity; await cart.save();
    const updated = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Remove item */
router.delete('/:itemId', verifyCustomer, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
    await cart.save();
    const updated = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Clear cart */
router.delete('/', verifyCustomer, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
