/* ─── Order Confirmation — Golden Luxury ───────────── */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const { data } = await api.get(`/orders/${id}`); setOrder(data); }
      catch {}
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  if (!order) return <div className="empty-state"><h3>Order not found</h3></div>;

  return (
    <div className="oc-page">
      <div className="oc-card">
        <div className="oc-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p className="oc-id">Order #{order.orderNumber || order._id}</p>
        <p className="oc-msg">Thank you for your purchase. Your order is being processed.</p>

        <div className="oc-details">
          <div className="oc-section">
            <h4>Order Items</h4>
            {order.items?.map((item, i) => (
              <div className="oc-item" key={i}>
                <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} />
                <div>
                  <p className="oc-item-name">{item.name}</p>
                  <p className="oc-item-qty">Qty: {item.quantity}</p>
                </div>
                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="oc-section">
            <h4>Shipping Address</h4>
            <p>{order.shippingAddress?.fullName}<br />{order.shippingAddress?.street}<br />{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
          </div>

          <div className="oc-section">
            <h4>Payment</h4>
            <p>Method: {order.paymentMethod?.toUpperCase()}</p>
            <p className="oc-total">Total: ₹{order.totalAmount?.toLocaleString()}</p>
          </div>
        </div>

        <div className="oc-actions">
          <Link to="/orders" className="btn btn-primary">View Orders</Link>
          <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
