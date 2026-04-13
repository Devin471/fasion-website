/* ─── Footer — Golden Luxury ───────────────────────── */
import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaTwitter, FaPinterest, FaApple, FaGooglePlay, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShoppingCart, FaUser, FaInfoCircle, FaShoppingBag } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  const path = window.location.pathname;
  if (path.startsWith('/seller/dashboard') || path.startsWith('/admin/dashboard')) return null;

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-col">
            <h3><img src="/logo-mf-luxury.svg" alt="MF Logo" className="logo-icon" style={{width:'2rem',height:'2rem',marginRight:'0.3rem'}} /> My<span className="logo-gold">Fashion</span></h3>
            <p>Your modern fashion marketplace for curated edits, trend drops, and premium everyday style.</p>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram"><FaInstagram /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook"><FaFacebook /></a>
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X (Twitter)" title="X"><FaTwitter /></a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest" title="Pinterest"><FaPinterest /></a>
            </div>
            <div className="footer-app-stores">
              <a href="https://apps.apple.com" target="_blank" rel="noreferrer" aria-label="Apple App Store" title="App Store"><FaApple /> App Store</a>
              <a href="https://play.google.com" target="_blank" rel="noreferrer" aria-label="Google Play Store" title="Google Play"><FaGooglePlay /> Play Store</a>
            </div>
          </div>
          <div className="footer-col">
            <h4><FaShoppingCart /> Shop</h4>
            <Link to="/shop">All Products</Link>
            <Link to="/shop/clothing">Clothing</Link>
            <Link to="/shop/electronics">Electronics</Link>
            <Link to="/shop/accessories">Accessories</Link>
          </div>
          <div className="footer-col">
            <h4><FaUser /> Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/orders">Track Order</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>
          <div className="footer-col">
            <h4><FaInfoCircle /> Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
          <div className="footer-col">
            <h4><FaShoppingBag /> Sell With Us</h4>
            <Link to="/seller/register">Become a Seller</Link>
            <Link to="/seller/login">Seller Login</Link>
            <p className="footer-mini-note">Download our app for quick product discovery and flash sale alerts.</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MyFashion. All rights reserved.</p>
      </div>
    </footer>
  );
}
