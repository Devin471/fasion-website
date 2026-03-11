/* ─── Payment Model ─────────────────────────────────── */
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order:         { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:        { type: Number, required: true },
  method:        { type: String, required: true, enum: ['cod', 'card', 'upi', 'wallet'] },
  status:        { type: String, default: 'pending', enum: ['pending', 'completed', 'failed', 'refunded'] },
  transactionId: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
