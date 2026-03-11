/* ─── User Profile Routes ─────────────────────────── */
const router = require('express').Router();
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const { verifyCustomer } = require('../middleware/auth');

/* Get profile */
router.get('/profile', verifyCustomer, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Update profile */
router.put('/profile', verifyCustomer, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Addresses */
router.post('/addresses', verifyCustomer, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses.push(req.body);
    await user.save();
    res.json(user.addresses);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/addresses/:addrId', verifyCustomer, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addrId);
    await user.save();
    res.json(user.addresses);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* Support tickets */
router.post('/tickets', verifyCustomer, async (req, res) => {
  try {
    const ticket = await Ticket.create({ ...req.body, user: req.user.id });
    res.status(201).json(ticket);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/tickets', verifyCustomer, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).sort('-createdAt');
    res.json(tickets);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
