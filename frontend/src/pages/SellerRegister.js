/* ─── Seller Register — Golden Luxury ──────────────── */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CustomerLogin.css';

export default function SellerRegister() {
  const { registerSeller } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', businessName: '', email: '', password: '', confirmPassword: '', phone: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    if (!form.name || !form.businessName || !form.email || !form.password) { setError('Name, business name, email and password required'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      await registerSeller(payload);
      navigate('/seller/dashboard');
    }
    catch (err) { setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed'); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <span className="auth-tag">✦ Start Selling</span>
          <h1>Join <span className="gold">MyFashion</span> as a Seller</h1>
          <p>Reach millions of customers and grow your business with our premium marketplace.</p>
          <div className="auth-features">
            <div className="auth-feature"><span>🌍</span>Nationwide reach</div>
            <div className="auth-feature"><span>📈</span>Growth tools</div>
            <div className="auth-feature"><span>🔒</span>Secure payments</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Seller Registration</h2>
          <p className="auth-subtitle">Create your seller account</p>
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group"><label>Full Name</label><input placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="form-group"><label>Business Name</label><input placeholder="Your Business" value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} /></div>
          <div className="form-group"><label>Email</label><input type="email" placeholder="business@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          <div className="form-group"><label>Phone</label><input type="tel" placeholder="9876543210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
          <div className="form-group"><label>Description</label><textarea rows={2} placeholder="Tell us about your business" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className="form-group"><label>Password</label><input type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
          <div className="form-group"><label>Confirm Password</label><input type="password" placeholder="Re-enter" value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} /></div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Registering...' : 'Create Seller Account'}</button>
          <p className="auth-switch">Already a seller? <Link to="/seller/login">Sign In</Link></p>
        </form>
      </div>
    </div>
  );
}
