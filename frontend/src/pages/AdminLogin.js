/* ─── Admin Login — Golden Luxury ──────────────────── */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CustomerLogin.css';

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    if (!form.email || !form.password) { setError('All fields required'); return; }
    setLoading(true);
    try { await loginAdmin(form.email, form.password); navigate('/admin/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <span className="auth-tag">✦ Admin Portal</span>
          <h1>Platform <span className="gold">Administration</span></h1>
          <p>Manage users, sellers, products and platform analytics from one dashboard.</p>
          <div className="auth-features">
            <div className="auth-feature"><span>👥</span>User management</div>
            <div className="auth-feature"><span>📊</span>Platform analytics</div>
            <div className="auth-feature"><span>🛡️</span>Content moderation</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Admin Login</h2>
          <p className="auth-subtitle">Restricted access — authorized personnel only</p>
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group"><label>Email</label><input type="email" placeholder="admin@myfashion.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          <div className="form-group"><label>Password</label>
            <div className="pwd-wrap"><input type={showPwd ? 'text' : 'password'} placeholder="Enter password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /><button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>{showPwd ? '🙈' : '👁'}</button></div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          <div className="auth-divider"><span>or</span></div>
          <div className="auth-roles"><Link to="/login" className="role-link">Customer Login →</Link><Link to="/seller/login" className="role-link">Seller Login →</Link></div>
        </form>
      </div>
    </div>
  );
}
