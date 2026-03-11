/* ─── Terms of Service — Golden Luxury ─────────────── */
import React from 'react';
import './Legal.css';

export default function Terms() {
  return (
    <div className="legal-page">
      <div className="about-hero"><span className="auth-tag">✦ Legal</span><h1>Terms of <span className="gold">Service</span></h1><p>Last updated: January 2025</p></div>
      <div className="legal-content">
        <section><h3>1. Acceptance of Terms</h3><p>By accessing and using ShopKart, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p></section>
        <section><h3>2. Account Registration</h3><p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials.</p></section>
        <section><h3>3. Purchases</h3><p>All purchases are subject to product availability. Prices are listed in INR and may change without notice. We reserve the right to refuse or cancel orders.</p></section>
        <section><h3>4. Seller Obligations</h3><p>Sellers must provide accurate product descriptions, maintain quality standards, fulfill orders promptly, and comply with all applicable laws.</p></section>
        <section><h3>5. Returns & Refunds</h3><p>Products may be returned within 7 days of delivery. Refunds are processed within 5-7 business days after we receive the returned item.</p></section>
        <section><h3>6. Prohibited Activities</h3><p>Users may not engage in fraud, sell counterfeit goods, harass other users, or use the platform for any illegal purpose.</p></section>
        <section><h3>7. Limitation of Liability</h3><p>ShopKart acts as a marketplace facilitator. We are not liable for the quality of products sold by third-party sellers.</p></section>
        <section><h3>8. Changes to Terms</h3><p>We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p></section>
      </div>
    </div>
  );
}
