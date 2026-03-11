/* ─── Cart Page — Golden Luxury ────────────────────── */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export default function Cart() {
  const { cart, updateQuantity, removeItem, clearCart, cartCount } = useCart();
  const { isCustomer } = useAuth();
  const navigate = useNavigate();
  const items = cart.items || [];

  const subtotal = items.reduce((s, i) => {
    const price = i.product?.price || 0;
    return s + price * (i.quantity || 1);
  }, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add some luxury products to get started!</p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping <span className="gold">Cart</span> ({cartCount})</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item, idx) => {
            const p = item.product || {};
            return (
              <div className="cart-item" key={item._id || idx}>
                <img src={p.images?.[0] || 'https://via.placeholder.com/100'} alt={p.name} />
                <div className="ci-info">
                  <Link to={`/product/${p._id}`} className="ci-name">{p.name}</Link>
                  {p.brand && <p className="ci-brand">{p.brand}</p>}
                  <p className="ci-price">₹{p.price?.toLocaleString()}</p>
                </div>
                <div className="ci-qty">
                  <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
                <p className="ci-total">₹{(p.price * item.quantity).toLocaleString()}</p>
                <button className="ci-remove" onClick={() => removeItem(item._id)}>✕</button>
              </div>
            );
          })}
          <button className="btn btn-outline" onClick={clearCart}>Clear Cart</button>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="cs-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="cs-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
          <hr />
          <div className="cs-row cs-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          {shipping > 0 && <p className="cs-hint">Add ₹{(999 - subtotal).toLocaleString()} more for free shipping</p>}
          <button className="btn btn-primary btn-full" onClick={() => isCustomer ? navigate('/checkout') : navigate('/login')}>
            {isCustomer ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
          <Link to="/shop" className="cs-continue">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
