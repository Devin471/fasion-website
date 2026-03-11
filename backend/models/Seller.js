/* ─── Seller Model ──────────────────────────────────── */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sellerSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  password:      { type: String, required: true, minlength: 6 },
  businessName:  { type: String, required: true },
  description:   { type: String, default: '' },
  phone:         { type: String, default: '' },
  address:       { type: String, default: '' },
  gstNumber:     { type: String, default: '' },
  bankDetails:   { type: String, default: '' },
  logo:          { type: String, default: '' },
  status:        { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected', 'suspended'] },
  totalSales:    { type: Number, default: 0 },
  totalRevenue:  { type: Number, default: 0 },
  rating:        { type: Number, default: 0 },
  isActive:      { type: Boolean, default: true }
}, { timestamps: true });

sellerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

sellerSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('Seller', sellerSchema);
