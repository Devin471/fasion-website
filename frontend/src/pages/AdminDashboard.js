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

/* ── Categories ── */
function Categories() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', image: '' });
  useEffect(() => { api.get('/categories').then(r => setCats(r.data)).catch(() => {}); }, []);
  const addCat = async e => { e.preventDefault(); try { const { data } = await api.post('/categories', form); setCats(c => [...c, data]); setForm({ name: '', description: '', image: '' }); } catch {} };
  const deleteCat = async id => { try { await api.delete(`/categories/${id}`); setCats(c => c.filter(x => x._id !== id)); } catch {} };
  return (
    <div>
      <h2>Categories</h2>
      <form className="sd-form" onSubmit={addCat} style={{ marginBottom: '1.5rem' }}>
        <div className="form-row">
          <div className="form-group"><label>Name</label><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="form-group"><label>Image URL</label><input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} /></div>
        </div>
        <div className="form-group"><label>Description</label><input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
        <button type="submit" className="btn btn-primary">Add Category</button>
      </form>
      <div className="sd-table-wrap"><table className="sd-table">
        <thead><tr><th>Name</th><th>Slug</th><th>Actions</th></tr></thead>
        <tbody>{cats.map(c => (<tr key={c._id}><td>{c.name}</td><td>{c.slug}</td><td><button className="sd-action-btn danger" onClick={() => deleteCat(c._id)}>Delete</button></td></tr>))}</tbody>
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

/* ── Tickets ── */
function Tickets() {
  const [tickets, setTickets] = useState([]);
  useEffect(() => { api.get('/admin/tickets').then(r => setTickets(r.data)).catch(() => {}); }, []);
  const updateStatus = async (id, status) => { try { await api.put(`/admin/tickets/${id}`, { status }); setTickets(t => t.map(x => x._id === id ? { ...x, status } : x)); } catch {} };
  return (
    <div>
      <h2>Support Tickets ({tickets.length})</h2>
      {tickets.length === 0 ? <p className="no-data">No tickets</p> : (
        <div className="sd-table-wrap"><table className="sd-table">
          <thead><tr><th>Subject</th><th>User</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>{tickets.map(t => (
            <tr key={t._id}><td>{t.subject}</td><td>{t.name || t.email}</td>
              <td><span className={`sd-badge ${t.status === 'open' ? 'pending' : t.status === 'resolved' ? 'approved' : ''}`}>{t.status}</span></td>
              <td>{new Date(t.createdAt).toLocaleDateString()}</td>
              <td><select value={t.status} onChange={e => updateStatus(t._id, e.target.value)}>
                {['open','in_progress','resolved','closed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
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

/* ── Main Admin Shell ── */
export default function AdminDashboard() {
  const { admin, logoutAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const links = [
    { to: '/admin/dashboard', label: 'Overview', icon: '📊' },
    { to: '/admin/users', label: 'Users', icon: '👥' },
    { to: '/admin/sellers', label: 'Sellers', icon: '🏪' },
    { to: '/admin/products', label: 'Products', icon: '📦' },
    { to: '/admin/categories', label: 'Categories', icon: '📁' },
    { to: '/admin/orders', label: 'Orders', icon: '🛒' },
    { to: '/admin/payments', label: 'Payments', icon: '💳' },
    { to: '/admin/reports', label: 'Reports', icon: '📈' },
    { to: '/admin/tickets', label: 'Tickets', icon: '🎫' },
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
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="*" element={<Overview />} />
        </Routes>
      </main>
    </div>
  );
}
