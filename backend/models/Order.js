/* ─── Order Model ───────────────────────────────────── */
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     String,
  image:    String,
  price:    Number,
  quantity: { type: Number, required: true, min: 1 },
  seller:   { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }
});

const orderSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber:    { type: String, unique: true },
  items:          [orderItemSchema],
  shippingAddress: {
    fullName: String,
    phone:    String,
    line1:    String,
    line2:    String,
    city:     String,
    state:    String,
    pincode:  String
  },
  paymentMethod:  { type: String, default: 'cod', enum: ['cod', 'card', 'upi', 'wallet'] },
  paymentStatus:  { type: String, default: 'pending', enum: ['pending', 'paid', 'failed', 'refunded'] },
  totalAmount:    { type: Number, required: true },
  shippingCost:   { type: Number, default: 0 },
  status:         { type: String, default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
  deliveredAt:    Date
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'SK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
