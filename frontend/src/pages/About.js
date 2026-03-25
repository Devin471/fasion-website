/* ─── About Page — Golden Luxury ───────────────────── */
import React from 'react';
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <span className="auth-tag">✦ Our Story</span>
        <h1>About <span className="gold">MyFashion</span></h1>
        <p>India's premium multi-vendor marketplace connecting buyers with verified sellers worldwide.</p>
      </div>

      <div className="about-grid">
        {[
          { icon: '🎯', title: 'Our Mission', text: 'To democratize e-commerce by empowering sellers of all sizes to reach millions of customers through a premium, trusted marketplace.' },
          { icon: '👁️', title: 'Our Vision', text: 'To become India\'s most trusted marketplace where quality meets affordability, and every purchase feels premium.' },
          { icon: '💎', title: 'Quality First', text: 'Every seller on MyFashion goes through a rigorous verification process. We ensure that only genuine, quality products reach your doorstep.' },
          { icon: '🤝', title: 'Seller Support', text: 'We provide sellers with powerful tools, analytics, and support to grow their business. Your success is our success.' },
        ].map((item, i) => (
          <div className="about-card" key={i}>
            <span className="about-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>

      <div className="about-stats">
        {[
          { num: '10K+', label: 'Products' },
          { num: '500+', label: 'Verified Sellers' },
          { num: '1M+', label: 'Happy Customers' },
          { num: '50+', label: 'Categories' },
        ].map((s, i) => (
          <div className="about-stat" key={i}>
            <span className="about-stat-num">{s.num}</span>
            <span className="about-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
