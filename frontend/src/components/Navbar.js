/* ─── Navbar — Golden Luxury ───────────────────────── */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Navbar.css';

export default function Navbar() {
  const { customer, isCustomer, isSeller, isAdmin,
          logoutCustomer, logoutSeller, logoutAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropRef = useRef();

  useEffect(() => {
    const h = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSearch = e => { e.preventDefault(); if (query.trim()) { navigate(`/search?q=${encodeURIComponent(query.trim())}`); setQuery(''); } };

  /* hide navbar on seller/admin dashboards */
  const path = window.location.pathname;
  if (path.startsWith('/seller/dashboard') || path.startsWith('/admin/dashboard')) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">♦</span>
          <span className="logo-text">SHOP<span className="logo-gold">KART</span></span>
        </Link>

        <div className="nav-links-main">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/shop">Categories</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <form className="nav-search" onSubmit={handleSearch}>
          <input type="text" placeholder="Search for products, brands and more..." value={query} onChange={e => setQuery(e.target.value)} />
          <button type="submit">⌕</button>
        </form>

        <div className="nav-actions">
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
              <button className="nav-link" onClick={() => { logoutAdmin(); navigate('/'); }}>Logout</button>
            </>
          ) : isSeller ? (
            <>
              <Link to="/seller/dashboard" className="nav-link">Dashboard</Link>
              <button className="nav-link" onClick={() => { logoutSeller(); navigate('/'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/wishlist" className="nav-icon-link">
                <span className="nav-icon">♡</span>
                {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
              </Link>
              <Link to="/cart" className="nav-icon-link">
                <span className="nav-icon">🛒</span>
                {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
              </Link>
              {isCustomer ? (
                <div className="nav-dropdown" ref={dropRef}>
                  <button className="nav-user-btn" onClick={() => setDropdown(!dropdown)}>
                    <span className="nav-avatar">{customer?.name?.[0]?.toUpperCase() || 'U'}</span>
                    <span className="nav-username">{customer?.name?.split(' ')[0]}</span>
                  </button>
                  {dropdown && (
                    <div className="dropdown-menu">
                      <Link to="/profile" onClick={() => setDropdown(false)}>My Profile</Link>
                      <Link to="/orders" onClick={() => setDropdown(false)}>My Orders</Link>
                      <Link to="/wishlist" onClick={() => setDropdown(false)}>My Wishlist</Link>
                      <hr />
                      <button onClick={() => { logoutCustomer(); setDropdown(false); navigate('/'); }}>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="nav-login-btn">Login</Link>
              )}
            </>
          )}
        </div>

        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="nav-mobile-menu">
          <form className="nav-search mobile" onSubmit={handleSearch}>
            <input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} />
            <button type="submit">⌕</button>
          </form>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Categories</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          {isCustomer && <Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>}
          {isCustomer && <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>}
          {!isCustomer && !isSeller && !isAdmin && <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>}
        </div>
      )}
    </nav>
  );
}
