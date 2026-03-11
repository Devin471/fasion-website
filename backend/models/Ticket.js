/* ─── Support Ticket Model ──────────────────────────── */
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status:  { type: String, default: 'open', enum: ['open', 'in_progress', 'resolved', 'closed'] }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
