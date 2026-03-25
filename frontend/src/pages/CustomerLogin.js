/* ─── Customer Login — Golden Luxury Split Layout ──── */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGoogleAccessToken } from '../utils/googleAuth';
import './CustomerLogin.css';

export default function CustomerLogin() {
  const { loginCustomer, loginCustomerWithGoogle } = useAuth();
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

  const handleGoogle = async () => {
    try {
      setError('');
      setLoading(true);
      const accessToken = await getGoogleAccessToken();
      await loginCustomerWithGoogle(accessToken);
      navigate('/');
    } catch (err) {
      setError(err.message || err.response?.data?.error || 'Google sign-in failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <span className="auth-shape auth-shape-1"></span>
      <span className="auth-shape auth-shape-2"></span>
      <div className="auth-left">
        <img
          className="auth-photo"
          src="https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=1200&q=80"
          alt="Fashion editorial"
        />
        <div className="auth-left-content">
          <span className="auth-tag">Welcome Back</span>
          <h1>Sign in and style your next look</h1>
          <p>Access your saved outfits, latest drops, and seamless checkout.</p>
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
          <p className="auth-subtitle">Enter your credentials</p>
          {error && <div className="auth-error">{error}</div>}
          <div className="floating-field">
            <input
              id="login-email"
              type="email"
              placeholder=" "
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
            <label htmlFor="login-email">Email Address</label>
          </div>
          <div className="floating-field">
            <div className="pwd-wrap">
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                placeholder=" "
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
              <label htmlFor="login-password">Password</label>
              <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>{showPwd ? '🙈' : '👁'}</button>
            </div>
          </div>
          <div className="auth-forgot-wrap">
            <a href="mailto:support@myfashion.com" className="auth-forgot">Forgot password?</a>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          <p className="auth-switch">Don't have an account? <Link to="/register">Create Account</Link></p>
          <div className="auth-divider"><span>or</span></div>
          <div className="auth-socials">
            <button type="button" className="social-btn" onClick={handleGoogle} disabled={loading}>Continue with Google</button>
          </div>
          <div className="auth-roles">
            <Link to="/seller/login" className="role-link">Seller Login →</Link>
            <Link to="/admin/login" className="role-link">Admin Login →</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
