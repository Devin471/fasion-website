/* ─── Admin Dashboard — Golden Luxury ──────────────── */
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './SellerDashboard.css';

/* ── Overview ── */
function Overview() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}); }, []);
  if (!stats) return <div className="loading-spinner"><div className="spinner"></div></div>;
  return (
    <div>
      <h2>Admin Overview</h2>
      <div className="sd-stats-grid">
        {[
          { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥' },
          { label: 'Total Sellers', value: stats.totalSellers || 0, icon: '🏪' },
          { label: 'Total Products', value: stats.totalProducts || 0, icon: '📦' },
          { label: 'Total Orders', value: stats.totalOrders || 0, icon: '🛒' },
          { label: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: '💰' },
          { label: 'Pending Sellers', value: stats.pendingSellers || 0, icon: '⏳' },
          { label: 'Categories', value: stats.totalCategories || 0, icon: '📁' },
          { label: 'Open Tickets', value: stats.openTickets || 0, icon: '🎫' },
        ].map((s, i) => (
          <div className="sd-stat-card" key={i}><span className="sd-stat-icon">{s.icon}</span><div><p className="sd-stat-val">{s.value}</p><p className="sd-stat-label">{s.label}</p></div></div>
        ))}
      </div>
    </div>
  );
}

/* ── Users ── */
function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => { api.get('/admin/users').then(r => setUsers(r.data)).catch(() => {}); }, []);
  const toggleActive = async (id, isActive) => { try { await api.put(`/admin/users/${id}`, { isActive: !isActive }); setUsers(u => u.map(x => x._id === id ? { ...x, isActive: !isActive } : x)); } catch {} };
  return (
    <div>
      <h2>Users ({users.length})</h2>
      <div className="sd-table-wrap"><table className="sd-table">
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{users.map(u => (
          <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.phone || '—'}</td>
            <td><span className={`sd-badge ${u.isActive ? 'approved' : 'cancelled'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
            <td><button className="sd-action-btn" onClick={() => toggleActive(u._id, u.isActive)}>{u.isActive ? 'Deactivate' : 'Activate'}</button></td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}

/* ── Sellers ── */
function Sellers() {
  const [sellers, setSellers] = useState([]);
  useEffect(() => { api.get('/admin/sellers').then(r => setSellers(r.data)).catch(() => {}); }, []);
  const updateStatus = async (id, status) => { try { await api.put(`/admin/sellers/${id}`, { status }); setSellers(s => s.map(x => x._id === id ? { ...x, status } : x)); } catch {} };
  return (
    <div>
      <h2>Sellers ({sellers.length})</h2>
      <div className="sd-table-wrap"><table className="sd-table">
        <thead><tr><th>Business</th><th>Email</th><th>Status</th><th>Revenue</th><th>Actions</th></tr></thead>
        <tbody>{sellers.map(s => (
          <tr key={s._id}><td>{s.businessName}</td><td>{s.email}</td>
            <td><span className={`sd-badge ${s.status}`}>{s.status}</span></td>
            <td>₹{(s.totalRevenue || 0).toLocaleString()}</td>
            <td><select value={s.status} onChange={e => updateStatus(s._id, e.target.value)}>
              {['pending','approved','rejected','suspended'].map(st => <option key={st} value={st}>{st}</option>)}
            </select></td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}

/* ── Products ── */
function AdminProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => { api.get('/admin/products').then(r => setProducts(r.data.products || r.data)).catch(() => {}); }, []);
  const toggleApproval = async (id, current) => { try { await api.put(`/admin/products/${id}`, { isApproved: !current }); setProducts(p => p.map(x => x._id === id ? { ...x, isApproved: !current } : x)); } catch {} };
  const deleteProduct = async (id) => { if (!window.confirm('Delete?')) return; try { await api.delete(`/admin/products/${id}`); setProducts(p => p.filter(x => x._id !== id)); } catch {} };
  return (
    <div>
      <h2>All Products ({products.length})</h2>
      <div className="sd-table-wrap"><table className="sd-table">
        <thead><tr><th>Product</th><th>Seller</th><th>Price</th><th>Stock</th><th>Approved</th><th>Actions</th></tr></thead>
        <tbody>{products.map(p => (
          <tr key={p._id}>
            <td><div className="sd-product-cell"><img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt="" /><span>{p.name}</span></div></td>
            <td>{p.seller?.businessName || 'N/A'}</td><td>₹{p.price?.toLocaleString()}</td><td>{p.stock}</td>
            <td><span className={`sd-badge ${p.isApproved ? 'approved' : 'pending'}`}>{p.isApproved ? 'Yes' : 'No'}</span></td>
            <td><button className="sd-action-btn" onClick={() => toggleApproval(p._id, p.isApproved)}>{p.isApproved ? 'Unapprove' : 'Approve'}</button><button className="sd-action-btn danger" onClick={() => deleteProduct(p._id)}>Delete</button></td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}

function AdminReviews() {
  const [products, setProducts] = useState([]);
  useEffect(() => { api.get('/admin/products').then(r => setProducts(r.data.products || r.data)).catch(() => {}); }, []);
  return (
    <div>
      <h2>Reviews & Ratings</h2>
      <div className="sd-table-wrap"><table className="sd-table">
        <thead><tr><th>Product</th><th>Rating</th><th>Reviews</th><th>Approval</th></tr></thead>
        <tbody>{products.map(p => (
          <tr key={p._id}>
            <td><div className="sd-product-cell"><img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt="" /><span>{p.name}</span></div></td>
            <td>{(p.rating || 0).toFixed(1)} / 5</td>
            <td>{p.numReviews || 0}</td>
            <td><span className={`sd-badge ${p.isApproved ? 'approved' : 'pending'}`}>{p.isApproved ? 'Approved' : 'Pending'}</span></td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}

/* ── Categories ── */
function Coupons() {
  const [form, setForm] = useState({ code: '', discount: '', expiresOn: '' });
  const [coupons, setCoupons] = useState([
    { code: 'STYLE10', discount: 10, expiresOn: '2026-12-31', status: 'active' },
    { code: 'WELCOME15', discount: 15, expiresOn: '2026-10-20', status: 'active' }
  ]);

  const addCoupon = (e) => {
    e.preventDefault();
    if (!form.code || !form.discount) return;
    setCoupons(c => [{ ...form, status: 'active' }, ...c]);
    setForm({ code: '', discount: '', expiresOn: '' });
  };

  return (
    <div>
      <h2>Coupons</h2>
      <form className="sd-form" onSubmit={addCoupon} style={{ marginBottom: '1.5rem' }}>
        <div className="form-row">
          <div className="form-group"><label>Coupon Code</label><input required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} /></div>
          <div className="form-group"><label>Discount (%)</label><input required type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} /></div>
          <div className="form-group"><label>Expiry Date</label><input type="date" value={form.expiresOn} onChange={e => setForm(f => ({ ...f, expiresOn: e.target.value }))} /></div>
        </div>
        <button type="submit" className="btn btn-primary">Create Coupon</button>
      </form>
      <div className="sd-table-wrap"><table className="sd-table">
        <thead><tr><th>Code</th><th>Discount</th><th>Expires On</th><th>Status</th></tr></thead>
        <tbody>{coupons.map((c, idx) => (
          <tr key={idx}><td>{c.code}</td><td>{c.discount}%</td><td>{c.expiresOn || 'N/A'}</td><td><span className="sd-badge approved">{c.status}</span></td></tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}

/* ── Orders ── */
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/admin/orders').then(r => setOrders(r.data)).catch(() => {}); }, []);
  return (
    <div>
      <h2>All Orders ({orders.length})</h2>
      <div className="sd-table-wrap"><table className="sd-table">
        <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>{orders.map(o => (
          <tr key={o._id}><td>#{o.orderNumber || o._id.slice(-8)}</td><td>{o.user?.name || 'N/A'}</td>
            <td>₹{o.totalAmount?.toLocaleString()}</td><td>{o.paymentMethod}</td>
            <td><span className={`sd-badge ${o.status}`}>{o.status}</span></td>
            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}

/* ── Payments ── */
function Payments() {
  const [payments, setPayments] = useState([]);
  useEffect(() => { api.get('/admin/payments').then(r => setPayments(r.data)).catch(() => {}); }, []);
  return (
    <div>
      <h2>Payments</h2>
      <div className="sd-table-wrap"><table className="sd-table">
        <thead><tr><th>Transaction</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>{payments.map(p => (
          <tr key={p._id}><td>{p.transactionId?.slice(-10) || '—'}</td><td>₹{p.amount?.toLocaleString()}</td>
            <td>{p.method}</td><td><span className={`sd-badge ${p.status}`}>{p.status}</span></td>
            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}

/* ── Reports ── */
function Reports() {
  const [reports, setReports] = useState(null);
  useEffect(() => { api.get('/admin/reports').then(r => setReports(r.data)).catch(() => {}); }, []);
  if (!reports) return <div className="loading-spinner"><div className="spinner"></div></div>;
  return (
    <div>
      <h2>Reports & Analytics</h2>
      <div className="sd-stats-grid">
        <div className="sd-stat-card"><span className="sd-stat-icon">💰</span><div><p className="sd-stat-val">₹{(reports.monthlyRevenue?.[0]?.total || 0).toLocaleString()}</p><p className="sd-stat-label">Monthly Revenue</p></div></div>
      </div>
      {reports.ordersByStatus?.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Orders by Status</h3>
          <div className="sd-stats-grid">
            {reports.ordersByStatus.map((s, i) => (
              <div className="sd-stat-card" key={i}><div><p className="sd-stat-val">{s.count}</p><p className="sd-stat-label">{s._id}</p></div></div>
            ))}
          </div>
        </div>
      )}
      {reports.topProducts?.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Top Products</h3>
          <div className="sd-table-wrap"><table className="sd-table">
            <thead><tr><th>Product</th><th>Sold</th><th>Revenue</th></tr></thead>
            <tbody>{reports.topProducts.map((p, i) => (
              <tr key={i}><td>{p.name}</td><td>{p.totalSold}</td><td>₹{p.totalRevenue?.toLocaleString()}</td></tr>
            ))}</tbody>
          </table></div>
        </div>
      )}
    </div>
  );
}

function AdminSettings() {
  const [form, setForm] = useState({ storeName: 'ShopKart', supportEmail: 'support@shopkart.com', autoApproveSellers: false });
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <h2>Settings</h2>
      {saved && <div className="profile-success">Settings updated.</div>}
      <form className="sd-form" onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2500); }}>
        <div className="form-group"><label>Store Name</label><input value={form.storeName} onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))} /></div>
        <div className="form-group"><label>Support Email</label><input value={form.supportEmail} onChange={e => setForm(f => ({ ...f, supportEmail: e.target.value }))} /></div>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={form.autoApproveSellers} onChange={e => setForm(f => ({ ...f, autoApproveSellers: e.target.checked }))} />
            Auto approve new sellers
          </label>
        </div>
        <button className="btn btn-primary" type="submit">Save Settings</button>
      </form>
    </div>
  );
}

/* ── Main Admin Shell ── */
export default function AdminDashboard() {
  const { admin, logoutAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const links = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/users', label: 'Users', icon: '👥' },
    { to: '/admin/sellers', label: 'Sellers', icon: '🏪' },
    { to: '/admin/products', label: 'Products', icon: '📦' },
    { to: '/admin/orders', label: 'Orders', icon: '🛒' },
    { to: '/admin/payments', label: 'Payments', icon: '💳' },
    { to: '/admin/reviews', label: 'Reviews', icon: '⭐' },
    { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { to: '/admin/coupons', label: 'Coupons', icon: '🏷️' },
    { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="sd-layout">
      <aside className="sd-sidebar">
        <div className="sd-brand">
          <Link to="/"><span className="logo-icon">♦</span> SHOP<span className="logo-gold">KART</span></Link>
          <span className="sd-role">Admin Panel</span>
        </div>
        <nav>
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`sd-nav-link ${path === l.to ? 'active' : ''}`}>
              <span>{l.icon}</span>{l.label}
            </Link>
          ))}
        </nav>
        <div className="sd-sidebar-footer">
          <div className="sd-user-info"><span className="sd-user-avatar">A</span><span>{admin?.name || 'Admin'}</span></div>
          <button onClick={() => { logoutAdmin(); navigate('/'); }}>Logout</button>
        </div>
      </aside>
      <main className="sd-main">
        <Routes>
          <Route path="dashboard" element={<Overview />} />
          <Route path="users" element={<Users />} />
          <Route path="sellers" element={<Sellers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="analytics" element={<Reports />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<Overview />} />
        </Routes>
      </main>
    </div>
  );
}
