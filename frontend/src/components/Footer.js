/* ─── Footer — Golden Luxury ───────────────────────── */
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const path = window.location.pathname;
  if (path.startsWith('/seller/dashboard') || path.startsWith('/admin/dashboard')) return null;

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-col">
            <h3><span className="logo-icon">♦</span> SHOP<span className="logo-gold">KART</span></h3>
            <p>Your modern fashion marketplace for curated edits, trend drops, and premium everyday style.</p>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">FB</a>
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">X</a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest">PT</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/shop">All Products</Link>
            <Link to="/shop/clothing">Clothing</Link>
            <Link to="/shop/electronics">Electronics</Link>
            <Link to="/shop/accessories">Accessories</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/orders">Track Order</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
          <div className="footer-col">
            <h4>Sell With Us</h4>
            <Link to="/seller/register">Become a Seller</Link>
            <Link to="/seller/login">Seller Login</Link>
            <p className="footer-mini-note">Download our app for quick product discovery and flash sale alerts.</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShopKart. All rights reserved.</p>
      </div>
    </footer>
  );
}
