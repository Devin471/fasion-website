/* ─── Seller Dashboard — Golden Luxury ─────────────── */
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './SellerDashboard.css';

/* ── Sub-components ── */
function Overview() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/seller/stats').then(r => setStats(r.data)).catch(() => {}); }, []);
  if (!stats) return <div className="loading-spinner"><div className="spinner"></div></div>;
  return (
    <div className="sd-overview">
      <h2>Dashboard Overview</h2>
      <div className="sd-stats-grid">
        {[
          { label: 'Total Products', value: stats.totalProducts || 0, icon: '📦' },
          { label: 'Total Orders', value: stats.totalOrders || 0, icon: '🛒' },
          { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: '💰' },
          { label: 'Rating', value: (stats.rating || 0).toFixed(1), icon: '⭐' },
        ].map((s, i) => (
          <div className="sd-stat-card" key={i}>
            <span className="sd-stat-icon">{s.icon}</span>
            <div><p className="sd-stat-val">{s.value}</p><p className="sd-stat-label">{s.label}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { api.get('/seller/products').then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);
  const handleDelete = async (id) => { if (!window.confirm('Delete this product?')) return; try { await api.delete(`/products/${id}`); setProducts(p => p.filter(x => x._id !== id)); } catch {} };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  return (
    <div>
      <div className="sd-section-header">
        <h2>My Products</h2>
        <button className="btn btn-primary" onClick={() => navigate('/seller/add-product')}>+ Add Product</button>
      </div>
      {products.length === 0 ? <p className="no-data">No products yet. Add your first product!</p> : (
        <div className="sd-table-wrap">
          <table className="sd-table">
            <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td><div className="sd-product-cell"><img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt="" /><span>{p.name}</span></div></td>
                  <td>₹{p.price?.toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td><span className={`sd-badge ${p.isApproved ? 'approved' : 'pending'}`}>{p.isApproved ? 'Approved' : 'Pending'}</span></td>
                  <td><button className="sd-action-btn" onClick={() => navigate(`/seller/edit-product/${p._id}`)}>Edit</button><button className="sd-action-btn danger" onClick={() => handleDelete(p._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AddProduct() {
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', originalPrice: '', category: '', brand: '', stock: '', images: '', sizes: '', colors: '', tags: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get('/categories').then(r => setCats(r.data)).catch(() => {}); }, []);

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = { ...form, price: +form.price, originalPrice: +form.originalPrice || +form.price, stock: +form.stock,
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
        sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      };
      await api.post('/products', payload);
      navigate('/seller/products');
    } catch {}
    setLoading(false);
  };

  return (
    <div>
      <h2>Add New Product</h2>
      <form className="sd-form" onSubmit={handleSubmit}>
        <div className="form-row"><div className="form-group"><label>Product Name</label><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="form-group"><label>Brand</label><input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} /></div></div>
        <div className="form-group"><label>Description</label><textarea rows={3} required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
        <div className="form-row"><div className="form-group"><label>Price (₹)</label><input type="number" required value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
          <div className="form-group"><label>Original Price</label><input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} /></div>
          <div className="form-group"><label>Stock</label><input type="number" required value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} /></div></div>
        <div className="form-group"><label>Category</label><select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}><option value="">Select</option>{cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
        <div className="form-group"><label>Image URLs (comma separated)</label><input value={form.images} onChange={e => setForm(f => ({ ...f, images: e.target.value }))} placeholder="https://..." /></div>
        <div className="form-row"><div className="form-group"><label>Sizes</label><input placeholder="S, M, L, XL" value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))} /></div>
          <div className="form-group"><label>Colors</label><input placeholder="Red, Blue" value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} /></div></div>
        <div className="form-group"><label>Tags</label><input placeholder="trending, new" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} /></div>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</button>
      </form>
    </div>
  );
}

function EditProduct() {
  const id = window.location.pathname.split('/').pop();
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.get(`/products/${id}`), api.get('/categories')]).then(([pr, cr]) => {
      const p = pr.data;
      setForm({ name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice, category: p.category?._id || p.category, brand: p.brand || '', stock: p.stock,
        images: (p.images || []).join(', '), sizes: (p.sizes || []).join(', '), colors: (p.colors || []).join(', '), tags: (p.tags || []).join(', ') });
      setCats(cr.data);
    }).catch(() => {});
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = { ...form, price: +form.price, originalPrice: +form.originalPrice, stock: +form.stock,
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
        sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean) };
      await api.put(`/products/${id}`, payload);
      navigate('/seller/products');
    } catch {}
    setLoading(false);
  };

  if (!form) return <div className="loading-spinner"><div className="spinner"></div></div>;
  return (
    <div>
      <h2>Edit Product</h2>
      <form className="sd-form" onSubmit={handleSubmit}>
        <div className="form-row"><div className="form-group"><label>Name</label><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="form-group"><label>Brand</label><input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} /></div></div>
        <div className="form-group"><label>Description</label><textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
        <div className="form-row"><div className="form-group"><label>Price</label><input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
          <div className="form-group"><label>Original Price</label><input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} /></div>
          <div className="form-group"><label>Stock</label><input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} /></div></div>
        <div className="form-group"><label>Category</label><select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}><option value="">Select</option>{cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
        <div className="form-group"><label>Images</label><input value={form.images} onChange={e => setForm(f => ({ ...f, images: e.target.value }))} /></div>
        <div className="form-row"><div className="form-group"><label>Sizes</label><input value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))} /></div>
          <div className="form-group"><label>Colors</label><input value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} /></div></div>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/orders/seller/list').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);
  const updateStatus = async (id, status) => { try { await api.put(`/orders/${id}/status`, { status }); setOrders(o => o.map(x => x._id === id ? { ...x, status } : x)); } catch {} };
  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;
  return (
    <div>
      <h2>Orders</h2>
      {orders.length === 0 ? <p className="no-data">No orders yet</p> : (
        <div className="sd-table-wrap"><table className="sd-table">
          <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{orders.map(o => (
            <tr key={o._id}>
              <td>#{o.orderNumber || o._id.slice(-8)}</td>
              <td>{o.user?.name || 'N/A'}</td>
              <td>₹{o.totalAmount?.toLocaleString()}</td>
              <td><span className={`sd-badge ${o.status}`}>{o.status}</span></td>
              <td><select value={o.status} onChange={e => updateStatus(o._id, e.target.value)}>
                {['processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
              </select></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  );
}

function Analytics() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/seller/analytics').then(r => setData(r.data)).catch(() => {}); }, []);
  if (!data) return <div className="loading-spinner"><div className="spinner"></div></div>;
  return (
    <div>
      <h2>Analytics</h2>
      <div className="sd-stats-grid">
        <div className="sd-stat-card"><span className="sd-stat-icon">📈</span><div><p className="sd-stat-val">₹{(data.monthlyRevenue || 0).toLocaleString()}</p><p className="sd-stat-label">This Month</p></div></div>
        <div className="sd-stat-card"><span className="sd-stat-icon">🛒</span><div><p className="sd-stat-val">{data.monthlyOrders || 0}</p><p className="sd-stat-label">Monthly Orders</p></div></div>
        <div className="sd-stat-card"><span className="sd-stat-icon">📦</span><div><p className="sd-stat-val">{data.totalProducts || 0}</p><p className="sd-stat-label">Products</p></div></div>
        <div className="sd-stat-card"><span className="sd-stat-icon">⭐</span><div><p className="sd-stat-val">{(data.avgRating || 0).toFixed(1)}</p><p className="sd-stat-label">Avg Rating</p></div></div>
      </div>
    </div>
  );
}

function Reviews() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => { api.get('/seller/reviews').then(r => setReviews(r.data)).catch(() => {}); }, []);
  return (
    <div>
      <h2>Customer Reviews</h2>
      {reviews.length === 0 ? <p className="no-data">No reviews yet</p> : (
        <div className="sd-reviews">{reviews.map(r => (
          <div className="review-card" key={r._id}>
            <div className="review-top"><span className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span><span className="review-author">{r.user?.name}</span></div>
            {r.title && <h5>{r.title}</h5>}
            <p>{r.comment}</p>
            <p className="review-product">Product: {r.product?.name}</p>
          </div>
        ))}</div>
      )}
    </div>
  );
}

function Settings() {
  const { seller } = useAuth();
  const [form, setForm] = useState({ businessName: '', description: '', phone: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => { if (seller) setForm({ businessName: seller.businessName || '', description: seller.description || '', phone: seller.phone || '' }); }, [seller]);

  const handleSave = async e => {
    e.preventDefault();
    try { await api.put('/seller/profile', form); setMsg('Profile updated!'); setTimeout(() => setMsg(''), 3000); } catch {}
  };

  return (
    <div>
      <h2>Seller Settings</h2>
      {msg && <div className="profile-success">{msg}</div>}
      <form className="sd-form" onSubmit={handleSave}>
        <div className="form-group"><label>Business Name</label><input value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} /></div>
        <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
        <div className="form-group"><label>Description</label><textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}

/* ── Main Dashboard Shell ── */
export default function SellerDashboard() {
  const { seller, logoutSeller } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const links = [
    { to: '/seller/dashboard', label: 'Overview', icon: '📊' },
    { to: '/seller/products', label: 'Products', icon: '📦' },
    { to: '/seller/add-product', label: 'Add Product', icon: '➕' },
    { to: '/seller/orders', label: 'Orders', icon: '🛒' },
    { to: '/seller/analytics', label: 'Analytics', icon: '📈' },
    { to: '/seller/reviews', label: 'Reviews', icon: '⭐' },
    { to: '/seller/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="sd-layout">
      <aside className="sd-sidebar">
        <div className="sd-brand">
          <Link to="/"><span className="logo-icon">♦</span> SHOP<span className="logo-gold">KART</span></Link>
          <span className="sd-role">Seller Panel</span>
        </div>
        <nav>
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`sd-nav-link ${path === l.to ? 'active' : ''}`}>
              <span>{l.icon}</span>{l.label}
            </Link>
          ))}
        </nav>
        <div className="sd-sidebar-footer">
          <div className="sd-user-info"><span className="sd-user-avatar">{seller?.businessName?.[0] || 'S'}</span><span>{seller?.businessName}</span></div>
          <button onClick={() => { logoutSeller(); navigate('/'); }}>Logout</button>
        </div>
      </aside>
      <main className="sd-main">
        <Routes>
          <Route path="dashboard" element={<Overview />} />
          <Route path="products" element={<Products />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Overview />} />
        </Routes>
      </main>
    </div>
  );
}
