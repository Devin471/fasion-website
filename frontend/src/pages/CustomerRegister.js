/* ─── Customer Register — Golden Luxury ────────────── */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGoogleAccessToken } from '../utils/googleAuth';
import './CustomerLogin.css';

export default function CustomerRegister() {
  const { registerCustomer, loginCustomerWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const strength = form.password.length >= 10 ? 'strong' : form.password.length >= 6 ? 'medium' : form.password.length > 0 ? 'weak' : 'none';

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Name, email, and password required'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await registerCustomer(form.name, form.email, form.password, form.phone);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
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
      setError(err.message || err.response?.data?.error || 'Google sign-up failed');
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
          src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=80"
          alt="Fashion inspired illustration"
        />
        <div className="auth-left-content">
          <span className="auth-tag">Join the Edit</span>
          <h1>Create your fashion profile</h1>
          <p>Unlock members-only drops, style boards, and fast mobile checkout.</p>
          <div className="auth-features">
            <div className="auth-feature"><span>🎁</span>Exclusive welcome offers</div>
            <div className="auth-feature"><span>🚚</span>Free shipping on first order</div>
            <div className="auth-feature"><span>🔔</span>Price drop alerts</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <p className="auth-subtitle">Start your premium shopping journey</p>
          {error && <div className="auth-error">{error}</div>}
          <div className="floating-field">
            <input id="reg-name" type="text" placeholder=" " value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            <label htmlFor="reg-name">Full Name</label>
          </div>
          <div className="floating-field">
            <input id="reg-email" type="email" placeholder=" " value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            <label htmlFor="reg-email">Email Address</label>
          </div>
          <div className="floating-field">
            <input id="reg-phone" type="tel" placeholder=" " value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <label htmlFor="reg-phone">Phone (optional)</label>
          </div>
          <div className="floating-field">
            <div className="pwd-wrap">
              <input id="reg-password" type={showPwd ? 'text' : 'password'} placeholder=" " value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
              <label htmlFor="reg-password">Password</label>
              <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>{showPwd ? '🙈' : '👁'}</button>
            </div>
            <div className={`password-strength ${strength}`}>
              <span></span><span></span><span></span>
              <small>{strength === 'none' ? 'Add a password' : `${strength} password`}</small>
            </div>
          </div>
          <div className="floating-field">
            <input id="reg-confirm" type="password" placeholder=" " value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} required />
            <label htmlFor="reg-confirm">Confirm Password</label>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
          <div className="auth-socials">
            <button type="button" className="social-btn" onClick={handleGoogle} disabled={loading}>Sign up with Google</button>
          </div>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
        </form>
      </div>
    </div>
  );
}
