/* ─── Customer Login — Golden Luxury Split Layout ──── */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CustomerLogin.css';

export default function CustomerLogin() {
  const { loginCustomer } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('All fields are required'); return; }
    setLoading(true);
    try {
      await loginCustomer(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <span className="auth-tag">✦ Welcome Back</span>
          <h1>Sign in to <span className="gold">ShopKart</span></h1>
          <p>Access your orders, wishlist and personalized recommendations.</p>
          <div className="auth-features">
            <div className="auth-feature"><span>🛒</span>Track your orders</div>
            <div className="auth-feature"><span>♡</span>Save to wishlist</div>
            <div className="auth-feature"><span>⚡</span>Faster checkout</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <p className="auth-subtitle">Enter your credentials to continue</p>
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="pwd-wrap">
              <input type={showPwd ? 'text' : 'password'} placeholder="Enter password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>{showPwd ? '🙈' : '👁'}</button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          <p className="auth-switch">Don't have an account? <Link to="/register">Create Account</Link></p>
          <div className="auth-divider"><span>or</span></div>
          <div className="auth-roles">
            <Link to="/seller/login" className="role-link">Seller Login →</Link>
            <Link to="/admin/login" className="role-link">Admin Login →</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
