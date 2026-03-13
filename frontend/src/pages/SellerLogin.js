/* ─── Seller Login — Golden Luxury ─────────────────── */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGoogleAccessToken } from '../utils/googleAuth';
import './CustomerLogin.css';

export default function SellerLogin() {
  const { loginSeller, loginSellerWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    if (!form.email || !form.password) { setError('All fields required'); return; }
    setLoading(true);
    try { await loginSeller(form.email, form.password); navigate('/seller/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    setLoading(false);
  };

  const handleGoogle = async () => {
    try {
      setError('');
      setLoading(true);
      const accessToken = await getGoogleAccessToken();
      await loginSellerWithGoogle(accessToken);
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.message || err.response?.data?.error || 'Google sign-in failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <span className="auth-tag">✦ Seller Portal</span>
          <h1>Grow Your <span className="gold">Business</span></h1>
          <p>Access your seller dashboard to manage products, track orders and grow revenue.</p>
          <div className="auth-features">
            <div className="auth-feature"><span>📦</span>Manage products</div>
            <div className="auth-feature"><span>📊</span>Sales analytics</div>
            <div className="auth-feature"><span>💰</span>Revenue tracking</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Seller Login</h2>
          <p className="auth-subtitle">Access your seller dashboard</p>
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group"><label>Email</label><input type="email" placeholder="seller@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          <div className="form-group"><label>Password</label>
            <div className="pwd-wrap"><input type={showPwd ? 'text' : 'password'} placeholder="Enter password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /><button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>{showPwd ? '🙈' : '👁'}</button></div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          <p className="auth-switch">New seller? <Link to="/seller/register">Register Here</Link></p>
          <div className="auth-divider"><span>or</span></div>
          <div className="auth-socials">
            <button type="button" className="social-btn" onClick={handleGoogle} disabled={loading}>Continue with Google</button>
          </div>
          <div className="auth-roles"><Link to="/login" className="role-link">Customer Login →</Link><Link to="/admin/login" className="role-link">Admin Login →</Link></div>
        </form>
      </div>
    </div>
  );
}
