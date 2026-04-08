/* ─── Payment — Golden Luxury with Razorpay ────────── */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Payment.css';

export default function Payment() {
  const { cart, clearCart } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState('upi');
  const [delivery, setDelivery] = useState('standard');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const items = cart.items || [];
  const address = JSON.parse(sessionStorage.getItem('checkoutAddress') || '{}');

  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * (i.quantity || 1), 0);
  const shipping = delivery === 'express' ? 199 : subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  // Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay Payment
  const handleRazorpayPayment = async () => {
    setProcessing(true);
    setError('');
    
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Failed to load Razorpay');

      // Create order on backend
      const { data } = await api.post('/api/orders', {
        shippingAddress: address,
        paymentMethod: method,
        items: items,
        subtotal,
        shipping,
        total
      });

      const orderId = data.order?._id || data._id;

      // Create Razorpay order
      const { data: razorpayData } = await api.post('/api/orders/create-razorpay-order', {
        orderId: orderId,
        amount: Math.round(total * 100), // Convert to paise
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: Math.round(total * 100),
        currency: 'INR',
        name: 'MyFashion',
        description: `Order #${orderId}`,
        image: '/logo-mf-luxury.svg',
        order_id: razorpayData.razorpayOrderId,
        prefill: {
          name: address.fullName || customer?.name || 'Customer',
          email: customer?.email || 'customer@example.com',
          contact: address.phone || customer?.phone || '',
        },
        handler: async (response) => {
          try {
            // Verify payment on backend
            const { data: verifyData } = await api.post('/api/orders/verify-razorpay-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId
            });

            if (verifyData.success) {
              setSuccess(true);
              await clearCart();
              sessionStorage.removeItem('checkoutAddress');
              setTimeout(() => navigate(`/order-confirmation/${orderId}`), 1500);
            } else {
              setError('Payment verification failed');
            }
          } catch (err) {
            setError(err.response?.data?.error || 'Payment verification failed');
          }
          setProcessing(false);
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            setError('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Payment failed');
      setProcessing(false);
    }
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="payment-page">
      <h1>Complete Payment</h1>
      {success && <div className="payment-success">✅ Payment successful! Redirecting...</div>}
      {error && <div className="payment-error">❌ {error}</div>}
      
      <div className="payment-layout">
        <div className="payment-left">
          {/* Shipping Address */}
          <div className="payment-block">
            <h3>📍 Shipping Address</h3>
            <p className="payment-muted">
              <strong>{address.fullName || 'Customer'}</strong> · {address.phone || 'No phone'}
            </p>
            <p className="payment-muted">
              {address.line1 || 'Address not added'}{address.line2 ? `, ${address.line2}` : ''}<br />
              {address.city || ''} {address.state || ''} - {address.pincode || ''}
            </p>
          </div>

          {/* Delivery Options */}
          <div className="payment-block">
            <h3>🚚 Delivery Options</h3>
            <div className="delivery-row">
              <button 
                type="button" 
                className={`delivery-chip ${delivery === 'standard' ? 'active' : ''}`} 
                onClick={() => setDelivery('standard')}
              >
                <span>Standard</span>
                <span className="delivery-time">3-5 days</span>
              </button>
              <button 
                type="button" 
                className={`delivery-chip ${delivery === 'express' ? 'active' : ''}`} 
                onClick={() => setDelivery('express')}
              >
                <span>Express</span>
                <span className="delivery-time">1-2 days</span>
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="payment-block">
            <h3>💳 Payment Methods</h3>
            <div className="payment-method-grid">
              {[
                { id: 'upi', label: 'UPI', icon: '📱', desc: 'GPay, PhonePe, Paytm' },
                { id: 'card', label: 'Debit/Credit Card', icon: '💳', desc: 'Visa, MasterCard' },
                { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
                { id: 'wallet', label: 'Wallets', icon: '👛', desc: 'Paytm, Amazon' },
                { id: 'applepay', label: 'Apple Pay', icon: '🍎', desc: 'iOS secure' },
                { id: 'gpay', label: 'Google Pay', icon: '🟦', desc: 'Android' }
              ].map(m => (
                <button 
                  key={m.id} 
                  type="button" 
                  className={`pm-option ${method === m.id ? 'active' : ''}`} 
                  onClick={() => setMethod(m.id)}
                >
                  <span className="pm-icon">{m.icon}</span>
                  <div>
                    <p className="pm-label">{m.label}</p>
                    <p className="pm-desc">{m.desc}</p>
                  </div>
                  {method === m.id && <span className="check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Checkout */}
        <div className="payment-summary">
          <h3>📦 Order Summary</h3>
          <div className="payment-items">
            {items.map((item, idx) => (
              <div key={idx} className="payment-item-row">
                <img 
                  src={item.product?.images?.[0] || 'https://via.placeholder.com/60'} 
                  alt={item.product?.name || 'Item'} 
                />
                <div style={{ flex: 1 }}>
                  <p className="pm-label">{item.product?.name}</p>
                  <p className="pm-desc">Qty: {item.quantity}</p>
                </div>
                <span className="pm-price">₹{((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="cost-breakdown">
            <div className="cs-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="cs-row">
              <span>Shipping ({delivery})</span>
              <span className={shipping === 0 ? 'text-success' : ''}>
                {shipping === 0 ? '✓ FREE' : `₹${shipping}`}
              </span>
            </div>
            <hr style={{ margin: '10px 0' }} />
            <div className="cs-row cs-total">
              <span>💰 Total Amount</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button 
            className="btn btn-primary btn-full" 
            onClick={handleRazorpayPayment} 
            disabled={processing || !method}
            style={{ marginTop: '20px', fontSize: '1.1rem' }}
          >
            {processing ? '⏳ Processing Payment...' : `Pay ₹${total.toLocaleString()}`}
          </button>

          <p style={{ 
            fontSize: '0.75rem', 
            color: 'var(--text-dim)', 
            marginTop: '10px', 
            textAlign: 'center' 
          }}>
            🔒 Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </div>
  );
}
