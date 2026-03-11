/* ─── Order History — Golden Luxury ────────────────── */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './OrderHistory.css';

const statusColors = { processing: '#d4a843', shipped: '#3498db', delivered: '#27ae60', cancelled: '#e74c3c' };

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const { data } = await api.get('/orders/my'); setOrders(data); }
      catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div className="oh-page">
      <h1>My <span className="gold">Orders</span></h1>
      {orders.length === 0 ? (
        <div className="empty-state"><h3>No orders yet</h3><p>Start shopping to see your orders here</p><Link to="/shop" className="btn btn-primary">Browse Shop</Link></div>
      ) : (
        <div className="oh-list">
          {orders.map(o => (
            <div className="oh-card" key={o._id}>
              <div className="oh-header">
                <div>
                  <span className="oh-id">#{o.orderNumber || o._id.slice(-8)}</span>
                  <span className="oh-date">{new Date(o.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="oh-status" style={{ color: statusColors[o.status] || '#d4a843', borderColor: statusColors[o.status] || '#d4a843' }}>{o.status}</span>
              </div>
              <div className="oh-items">
                {o.items?.slice(0, 3).map((item, i) => (
                  <div className="oh-item" key={i}>
                    <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} />
                    <div>
                      <p className="oh-item-name">{item.name}</p>
                      <p className="oh-item-meta">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {o.items?.length > 3 && <p className="oh-more">+{o.items.length - 3} more items</p>}
              </div>
              <div className="oh-footer">
                <span className="oh-total">₹{o.totalAmount?.toLocaleString()}</span>
                <span className="oh-payment">{o.paymentMethod?.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
