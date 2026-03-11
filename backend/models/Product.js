/* ─── Product Model ─────────────────────────────────── */
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  slug:           { type: String, required: true },
  description:    { type: String, default: '' },
  price:          { type: Number, required: true },
  originalPrice:  { type: Number, default: 0 },
  discount:       { type: Number, default: 0 },
  category:       { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  seller:         { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  images:         [String],
  brand:          { type: String, default: '' },
  stock:          { type: Number, default: 0 },
  sold:           { type: Number, default: 0 },
  rating:         { type: Number, default: 0 },
  numReviews:     { type: Number, default: 0 },
  sizes:          [String],
  colors:         [String],
  tags:           [String],
  isApproved:     { type: Boolean, default: true },
  isFeatured:     { type: Boolean, default: false },
  isActive:       { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
