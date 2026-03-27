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
  const [profileOpen, setProfileOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 820);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 820);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false);
    };
    const handleKeyDown = e => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen]);

  const handleSearch = e => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setMenuOpen(false);
      setProfileOpen(false);
      setShowMobileSearch(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
    setProfileOpen(false);
    setShowMobileSearch(false);
  };

  const handleProfileClick = () => {
    if (isMobile) {
      setMenuOpen(true);
      setProfileOpen(false);
    } else {
      setProfileOpen(prev => !prev);
    }
  };

  /* hide navbar on seller/admin dashboards */
  const path = window.location.pathname;
  if (path.startsWith('/seller/dashboard') || path.startsWith('/admin/dashboard')) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src="/logo-mf-luxury.svg" alt="MF Logo" className="logo-icon" style={{width:'2rem',height:'2rem',marginRight:'0.3rem'}} />
          <span className="logo-text">My<span className="logo-gold">Fashion</span></span>
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
          <button className="nav-search-toggle" onClick={() => setShowMobileSearch(s => !s)} aria-label="Toggle search">
            ⌕
          </button>
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
                <div className="nav-dropdown" ref={dropdownRef}>
                  <button className="nav-user-btn" onClick={handleProfileClick} aria-haspopup="true" aria-expanded={profileOpen}>
                    <span className="nav-avatar">{customer?.name?.[0]?.toUpperCase() || 'U'}</span>
                    <span className="nav-username">{customer?.name?.split(' ')[0]}</span>
                  </button>
                  {!isMobile && profileOpen && (
                    <div className="dropdown-menu">
                      <Link to="/profile" onClick={() => setProfileOpen(false)}>My Profile</Link>
                      <Link to="/orders" onClick={() => setProfileOpen(false)}>My Orders</Link>
                      <Link to="/wishlist" onClick={() => setProfileOpen(false)}>My Wishlist</Link>
                      <hr />
                      <button onClick={() => { logoutCustomer(); setProfileOpen(false); navigate('/'); }}>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button className="nav-user-btn" onClick={toggleMenu} aria-label="Open menu">
                    <span className="nav-avatar">U</span>
                  </button>
                  <Link to="/login" className="nav-login-btn">Login</Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {showMobileSearch && (
        <div className="nav-search-popover">
          <form className="nav-search" onSubmit={handleSearch}>
            <input placeholder="Search for products, brands and more..." value={query} onChange={e => setQuery(e.target.value)} />
            <button type="submit">⌕</button>
          </form>
        </div>
      )}

      {menuOpen && isMobile && (
        <div className="nav-mobile-overlay" onClick={() => setMenuOpen(false)}>
          <div className="nav-mobile-panel" onClick={e => e.stopPropagation()}>
            <div className="nav-mobile-menu">
              <Link to="/profile" onClick={() => setMenuOpen(false)}>My Profile</Link>
              {isCustomer && <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>}
              {isCustomer && <Link to="/wishlist" onClick={() => setMenuOpen(false)}>My Wishlist</Link>}
              {isCustomer && <button className="nav-link" onClick={() => { logoutCustomer(); setMenuOpen(false); navigate('/'); }}>Logout</button>}
              {!isCustomer && !isSeller && !isAdmin && <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
