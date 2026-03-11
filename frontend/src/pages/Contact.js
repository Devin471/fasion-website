/* ─── Contact Page — Golden Luxury ─────────────────── */
import React, { useState } from 'react';
import api from '../utils/api';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/users/tickets', form);
      setSent(true);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <span className="auth-tag">✦ Get in Touch</span>
        <h1>Contact <span className="gold">Us</span></h1>
        <p>Have a question or feedback? We'd love to hear from you.</p>
      </div>

      <div className="contact-layout">
        <div className="contact-info">
          {[
            { icon: '📍', title: 'Address', text: '123 Commerce Street, Mumbai 400001' },
            { icon: '📧', title: 'Email', text: 'support@shopkart.com' },
            { icon: '📞', title: 'Phone', text: '+91 1800-123-4567' },
            { icon: '⏰', title: 'Hours', text: 'Mon-Sat: 9AM - 8PM IST' },
          ].map((item, i) => (
            <div className="ci-card" key={i}>
              <span>{item.icon}</span>
              <div><h4>{item.title}</h4><p>{item.text}</p></div>
            </div>
          ))}
        </div>

        <div className="contact-form-wrap">
          {sent ? (
            <div className="contact-success">
              <span>✓</span>
              <h3>Message Sent!</h3>
              <p>We'll get back to you within 24 hours.</p>
              <button className="btn btn-outline" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Name</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Your name" /></div>
                <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="you@example.com" /></div>
              </div>
              <div className="form-group"><label>Subject</label><input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required placeholder="How can we help?" /></div>
              <div className="form-group"><label>Message</label><textarea rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required placeholder="Tell us more..." /></div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
