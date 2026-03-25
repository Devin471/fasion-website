/* ─── Privacy Policy — Golden Luxury ───────────────── */
import React from 'react';
import './Legal.css';

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="about-hero"><span className="auth-tag">✦ Legal</span><h1>Privacy <span className="gold">Policy</span></h1><p>Last updated: January 2025</p></div>
      <div className="legal-content">
        <section><h3>1. Information We Collect</h3><p>We collect information you provide directly: name, email, phone number, shipping addresses, and payment information. We also collect usage data including browsing history, search queries, and device information.</p></section>
        <section><h3>2. How We Use Your Information</h3><p>Your information is used to process orders, improve our services, send relevant communications, prevent fraud, and personalize your shopping experience.</p></section>
        <section><h3>3. Data Sharing</h3><p>We share your information with sellers to fulfill orders, payment processors for transactions, and logistics partners for delivery. We never sell your personal data to third parties.</p></section>
        <section><h3>4. Data Security</h3><p>We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your information.</p></section>
        <section><h3>5. Your Rights</h3><p>You have the right to access, correct, or delete your personal data. You can manage your preferences from your account settings or contact our support team.</p></section>
        <section><h3>6. Cookies</h3><p>We use cookies to enhance your experience, remember preferences, and analyze site traffic. You can manage cookie settings through your browser.</p></section>
        <section><h3>7. Contact Us</h3><p>For privacy-related inquiries, email us at privacy@myfashion.com or use our Contact page.</p></section>
      </div>
    </div>
  );
}
