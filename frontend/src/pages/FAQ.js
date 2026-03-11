/* ─── FAQ Page — Golden Luxury ─────────────────────── */
import React, { useState } from 'react';
import './FAQ.css';

const faqs = [
  { q: 'How do I place an order?', a: 'Browse products, add them to cart, proceed to checkout, fill shipping details, select payment method and confirm your order.' },
  { q: 'What payment methods do you accept?', a: 'We accept Cash on Delivery (COD), Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), and ShopKart Wallet.' },
  { q: 'How can I track my order?', a: 'Go to My Orders from your profile menu. You can see real-time status updates for all your orders.' },
  { q: 'What is the return policy?', a: 'We offer a 7-day easy return policy. If you\'re not satisfied, initiate a return from your order history.' },
  { q: 'How do I become a seller?', a: 'Click on "Start Selling" or navigate to the Seller Registration page. Fill in your business details and our team will review your application.' },
  { q: 'Is my payment information secure?', a: 'Absolutely. We use industry-standard encryption and never store your card details. All transactions are processed through secure payment gateways.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3-7 business days. Express delivery options are available for select products and locations.' },
  { q: 'Can I cancel my order?', a: 'Yes, you can cancel an order before it\'s shipped. Go to My Orders and click on the cancel option.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="faq-page">
      <div className="about-hero">
        <span className="auth-tag">✦ Help Center</span>
        <h1>Frequently Asked <span className="gold">Questions</span></h1>
        <p>Find answers to common questions about shopping, payments, and more.</p>
      </div>
      <div className="faq-list">
        {faqs.map((f, i) => (
          <div className={`faq-item ${open === i ? 'open' : ''}`} key={i} onClick={() => setOpen(open === i ? null : i)}>
            <div className="faq-q"><span>{f.q}</span><span className="faq-arrow">{open === i ? '−' : '+'}</span></div>
            {open === i && <div className="faq-a"><p>{f.a}</p></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
