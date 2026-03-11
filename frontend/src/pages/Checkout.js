/* ─── Checkout — Golden Luxury ─────────────────────── */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

export default function Checkout() {
  const { cart } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();
  const items = cart.items || [];
  const [address, setAddress] = useState({ fullName: customer?.name || '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [errors, setErrors] = useState({});

  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * (i.quantity || 1), 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const validate = () => {
    const e = {};
    if (!address.fullName) e.fullName = 'Name required';
    if (!address.phone || address.phone.length < 10) e.phone = 'Valid phone required';
    if (!address.street) e.street = 'Address required';
    if (!address.city) e.city = 'City required';
    if (!address.state) e.state = 'State required';
    if (!address.pincode || address.pincode.length < 5) e.pincode = 'Valid pincode required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const proceed = () => {
    if (!validate()) return;
    sessionStorage.setItem('checkoutAddress', JSON.stringify(address));
    navigate('/payment');
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <div className="checkout-form">
          <h3>Shipping Address</h3>
          {[
            { key: 'fullName', label: 'Full Name', type: 'text' },
            { key: 'phone', label: 'Phone Number', type: 'tel' },
            { key: 'street', label: 'Street Address', type: 'text' },
            { key: 'city', label: 'City', type: 'text' },
            { key: 'state', label: 'State', type: 'text' },
            { key: 'pincode', label: 'PIN Code', type: 'text' },
          ].map(f => (
            <div className="form-group" key={f.key}>
              <label>{f.label}</label>
              <input type={f.type} value={address[f.key]} onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))} className={errors[f.key] ? 'error' : ''} />
              {errors[f.key] && <span className="form-error">{errors[f.key]}</span>}
            </div>
          ))}
          <button className="btn btn-primary btn-full" onClick={proceed}>Continue to Payment</button>
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {items.map((item, i) => {
            const p = item.product || {};
            return (
              <div className="cos-item" key={i}>
                <img src={p.images?.[0] || 'https://via.placeholder.com/60'} alt={p.name} />
                <div><p className="cos-name">{p.name}</p><p className="cos-qty">Qty: {item.quantity}</p></div>
                <span className="cos-price">₹{(p.price * item.quantity).toLocaleString()}</span>
              </div>
            );
          })}
          <hr />
          <div className="cs-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="cs-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
          <div className="cs-row cs-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}
