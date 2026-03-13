/* ─── Payment — Golden Luxury ──────────────────────── */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import './Payment.css';

export default function Payment() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState('card');
  const [delivery, setDelivery] = useState('standard');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', holder: '' });
  const items = cart.items || [];
  const address = JSON.parse(sessionStorage.getItem('checkoutAddress') || '{}');

  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * (i.quantity || 1), 0);
  const shipping = delivery === 'express' ? 199 : subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const placeOrder = async () => {
    setProcessing(true);
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: address,
        paymentMethod: method,
      });
      setSuccess(true);
      await clearCart();
      sessionStorage.removeItem('checkoutAddress');
      setTimeout(() => navigate(`/order-confirmation/${data.order?._id || data._id}`), 1200);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    }
    setProcessing(false);
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="payment-page">
      <h1>Complete Payment</h1>
      {success && <div className="payment-success">Payment successful. Redirecting to confirmation...</div>}
      <div className="payment-layout">
        <div className="payment-left">
          <div className="payment-block">
            <h3>Shipping Address</h3>
            <p className="payment-muted">
              {address.fullName || 'Customer'} · {address.phone || 'No phone'}
            </p>
            <p className="payment-muted">
              {address.address || 'Address not added'}, {address.city || ''} {address.state || ''} {address.zipCode || ''}
            </p>
          </div>

          <div className="payment-block">
            <h3>Delivery Options</h3>
            <div className="delivery-row">
              <button type="button" className={`delivery-chip ${delivery === 'standard' ? 'active' : ''}`} onClick={() => setDelivery('standard')}>
                Standard (3-5 days)
              </button>
              <button type="button" className={`delivery-chip ${delivery === 'express' ? 'active' : ''}`} onClick={() => setDelivery('express')}>
                Express (1-2 days)
              </button>
            </div>
          </div>

          <div className="payment-block">
            <h3>Payment Methods</h3>
            <div className="payment-method-grid">
              {[
                { id: 'card', label: 'Credit Card', icon: '💳', desc: 'Visa, MasterCard, Amex' },
                { id: 'upi', label: 'UPI', icon: '📱', desc: 'GPay, PhonePe, Paytm' },
                { id: 'paypal', label: 'PayPal', icon: '🅿️', desc: 'Fast global checkout' },
                { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
                { id: 'applepay', label: 'Apple Pay', icon: '🍎', desc: 'iOS secure payment' },
                { id: 'gpay', label: 'Google Pay', icon: '🟦', desc: 'Google wallet' }
              ].map(m => (
                <button key={m.id} type="button" className={`pm-option ${method === m.id ? 'active' : ''}`} onClick={() => setMethod(m.id)}>
                  <span className="pm-icon">{m.icon}</span>
                  <div>
                    <p className="pm-label">{m.label}</p>
                    <p className="pm-desc">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {method === 'card' && (
            <div className="payment-block card-form-block">
              <h3>Card Details</h3>
              <div className="card-preview">
                <div className="card-chip"></div>
                <p>{card.number || '•••• •••• •••• ••••'}</p>
                <div>
                  <span>{card.holder || 'Cardholder Name'}</span>
                  <span>{card.expiry || 'MM/YY'}</span>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Card Number</label>
                  <input value={card.number} onChange={e => setCard(c => ({ ...c, number: e.target.value }))} placeholder="1234 5678 9012 3456" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))} placeholder="MM/YY" />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value }))} placeholder="123" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input value={card.holder} onChange={e => setCard(c => ({ ...c, holder: e.target.value }))} placeholder="John Doe" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="payment-summary">
          <h3>Order Summary</h3>
          <div className="payment-items">
            {items.map((item, idx) => (
              <div key={idx} className="payment-item-row">
                <img src={item.product?.images?.[0] || 'https://via.placeholder.com/60'} alt={item.product?.name || 'Item'} />
              <div>
                  <p className="pm-label">{item.product?.name}</p>
                  <p className="pm-desc">Qty: {item.quantity}</p>
                </div>
                <span>₹{((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="cs-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="cs-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}</span></div>
          <hr />
          <div className="cs-row cs-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          <button className="btn btn-primary btn-full" onClick={placeOrder} disabled={processing}>
            {processing ? 'Processing...' : `Complete Payment - ₹${total.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
}
