/* ─── Order Routes ─────────────────────────────────── */
const router = require('express').Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const { verifyCustomer, verifySeller } = require('../middleware/auth');

/* Create order */
router.post('/', verifyCustomer, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'cod' } = req.body;
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || !cart.items.length) return res.status(400).json({ error: 'Cart is empty' });

    const items = cart.items.map(i => ({
      product: i.product._id, name: i.product.name, image: i.product.images?.[0] || '',
      price: i.product.price, quantity: i.quantity, seller: i.product.seller
    }));
    const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);

    const order = await Order.create({ user: req.user.id, items, shippingAddress, paymentMethod, totalAmount });

    /* Update stock & create payment */
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, sold: item.quantity } });
    }
    await Payment.create({ order: order._id, user: req.user.id, amount: totalAmount, method: paymentMethod, status: paymentMethod === 'cod' ? 'pending' : 'completed' });
    await Cart.findOneAndDelete({ user: req.user.id });

    res.status(201).json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Customer: my orders */
router.get('/my', verifyCustomer, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt').populate('items.product', 'name images price');
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Customer: single order */
router.get('/:id', verifyCustomer, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id }).populate('items.product');
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Seller: orders containing their products */
router.get('/seller/list', verifySeller, async (req, res) => {
  try {
    const orders = await Order.find({ 'items.seller': req.seller._id }).sort('-createdAt').populate('user', 'name email');
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Update status (seller or admin via admin routes) */
router.put('/:id/status', verifySeller, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, 'items.seller': req.seller._id });
    if (!order) return res.status(404).json({ error: 'Not found' });
    order.status = req.body.status;
    if (req.body.status === 'delivered') order.deliveredAt = new Date();
    await order.save();
    res.json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
