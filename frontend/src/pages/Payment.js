/* ─── Payment — Golden Luxury ──────────────────────── */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import './Payment.css';

export default function Payment() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState('cod');
  const [processing, setProcessing] = useState(false);
  const items = cart.items || [];

  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * (i.quantity || 1), 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const placeOrder = async () => {
    setProcessing(true);
    try {
      const address = JSON.parse(sessionStorage.getItem('checkoutAddress') || '{}');
      const { data } = await api.post('/orders', {
        shippingAddress: address,
        paymentMethod: method,
      });
      await clearCart();
      sessionStorage.removeItem('checkoutAddress');
      navigate(`/order-confirmation/${data.order?._id || data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    }
    setProcessing(false);
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="payment-page">
      <h1>Payment</h1>
      <div className="payment-layout">
        <div className="payment-methods">
          <h3>Select Payment Method</h3>
          {[
            { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
            { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, etc.' },
            { id: 'upi', label: 'UPI Payment', icon: '📱', desc: 'GPay, PhonePe, Paytm' },
            { id: 'wallet', label: 'Digital Wallet', icon: '👛', desc: 'ShopKart Wallet' },
          ].map(m => (
            <div key={m.id} className={`pm-option ${method === m.id ? 'active' : ''}`} onClick={() => setMethod(m.id)}>
              <span className="pm-icon">{m.icon}</span>
              <div>
                <p className="pm-label">{m.label}</p>
                <p className="pm-desc">{m.desc}</p>
              </div>
              <span className={`pm-radio ${method === m.id ? 'checked' : ''}`}></span>
            </div>
          ))}
        </div>

        <div className="payment-summary">
          <h3>Order Total</h3>
          <div className="cs-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="cs-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
          <hr />
          <div className="cs-row cs-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          <button className="btn btn-primary btn-full" onClick={placeOrder} disabled={processing}>
            {processing ? 'Processing...' : `Place Order — ₹${total.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
}
