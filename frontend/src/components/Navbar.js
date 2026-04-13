/* ─── Navbar — Golden Luxury with Animations ───────────────────────── */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FaHome, FaShoppingBag, FaInfoCircle, FaPhone, FaSearch, FaHeart, FaShoppingCart, FaUser, FaSignOutAlt, FaCog, FaBox } from 'react-icons/fa';
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
  const hamburgerRef = useRef(null);

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

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = e => {
      if (hamburgerRef.current && !hamburgerRef.current.contains(e.target)) setMenuOpen(false);
    };
    const handleKeyDown = e => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

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
    setProfileOpen(prev => !prev);
    setMenuOpen(false);
    setShowMobileSearch(false);
  };

  /* hide navbar on seller/admin dashboards */
  const path = window.location.pathname;
  if (path.startsWith('/seller/dashboard') || path.startsWith('/admin/dashboard')) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Hamburger Menu - Dropdown Container */}
        <div ref={hamburgerRef} style={{ position: 'relative' }}>
          <button className="nav-hamburger" onClick={toggleMenu} aria-label="Open navigation menu">
            <span></span>
            <span></span>
            <span></span>
          </button>

          {menuOpen && isMobile && (
            <motion.div
              className="nav-mobile-panel"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <motion.div
                className="nav-mobile-menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {/* Main Navigation Links */}
                <motion.a
                  href="/"
                  className="nav-mobile-link"
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  whileHover={{ x: 10 }}
                >
                  <FaHome /> Home
                </motion.a>
                <motion.a
                  href="/shop"
                  className="nav-mobile-link"
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ x: 10 }}
                >
                  <FaShoppingBag /> Shop
                </motion.a>
                <motion.a
                  href="/about"
                  className="nav-mobile-link"
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ x: 10 }}
                >
                  <FaInfoCircle /> About
                </motion.a>
                <motion.a
                  href="/contact"
                  className="nav-mobile-link"
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ x: 10 }}
                >
                  <FaPhone /> Contact
                </motion.a>
                
                <div className="nav-mobile-divider" />
                
                {/* Profile Section - Only Show When Logged In */}
                {isCustomer ? (
                  <>
                    <motion.a
                      href="/profile"
                      className="nav-mobile-link"
                      onClick={() => setMenuOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                      whileHover={{ x: 10 }}
                    >
                      <FaUser /> My Profile
                    </motion.a>
                    <motion.a
                      href="/orders"
                      className="nav-mobile-link"
                      onClick={() => setMenuOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ x: 10 }}
                    >
                      <FaBox /> My Orders
                    </motion.a>
                    <motion.a
                      href="/wishlist"
                      className="nav-mobile-link"
                      onClick={() => setMenuOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 }}
                      whileHover={{ x: 10 }}
                    >
                      <FaHeart /> My Wishlist
                    </motion.a>
                    <div className="nav-mobile-divider" />
                    <motion.button
                      className="nav-mobile-logout"
                      onClick={() => { logoutCustomer(); setMenuOpen(false); navigate('/'); }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ x: 10 }}
                    >
                      <FaSignOutAlt /> Logout
                    </motion.button>
                  </>
                ) : (
                  <motion.a
                    href="/login"
                    className="nav-mobile-login"
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                    whileHover={{ x: 10 }}
                  >
                    <FaUser /> Login
                  </motion.a>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>

        <Link to="/" className="nav-logo">
          <motion.img
            src="/logo-mf-luxury.svg"
            alt="MF Logo"
            className="logo-icon"
            style={{ width: '2rem', height: '2rem', marginRight: '0.3rem' }}
            whileHover={{ rotate: 10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <span className="logo-text">My<span className="logo-gold">Fashion</span></span>
        </Link>

        <div className="nav-primary-box">
          <div className="nav-links-main">
            <motion.div whileHover={{ color: 'var(--coral)' }} transition={{ duration: 0.2 }}>
              <Link to="/"><FaHome /> Home</Link>
            </motion.div>
            <motion.div whileHover={{ color: 'var(--coral)' }} transition={{ duration: 0.2 }}>
              <Link to="/shop"><FaShoppingBag /> Shop</Link>
            </motion.div>
            <motion.div whileHover={{ color: 'var(--coral)' }} transition={{ duration: 0.2 }}>
              <Link to="/shop"><FaShoppingBag /> Categories</Link>
            </motion.div>
            <motion.div whileHover={{ color: 'var(--coral)' }} transition={{ duration: 0.2 }}>
              <Link to="/about"><FaInfoCircle /> About</Link>
            </motion.div>
            <motion.div whileHover={{ color: 'var(--coral)' }} transition={{ duration: 0.2 }}>
              <Link to="/contact"><FaPhone /> Contact</Link>
            </motion.div>
          </div>

          <form className="nav-search" onSubmit={handleSearch}>
            <input type="text" placeholder="Search for products, brands and more..." value={query} onChange={e => setQuery(e.target.value)} />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaSearch />
            </motion.button>
          </form>
        </div>

        <div className="nav-actions">
          <motion.button
            className="nav-search-toggle"
            onClick={() => setShowMobileSearch(s => !s)}
            aria-label="Toggle search"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaSearch />
          </motion.button>
          {isAdmin ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/admin/dashboard" className="nav-link"><FaCog /> Dashboard</Link>
              </motion.div>
              <motion.button
                className="nav-link"
                onClick={() => { logoutAdmin(); navigate('/'); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignOutAlt /> Logout
              </motion.button>
            </>
          ) : isSeller ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/seller/dashboard" className="nav-link"><FaCog /> Dashboard</Link>
              </motion.div>
              <motion.button
                className="nav-link"
                onClick={() => { logoutSeller(); navigate('/'); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignOutAlt /> Logout
              </motion.button>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Link to="/wishlist" className="nav-icon-link">
                  <FaHeart className="nav-icon" />
                  <AnimatePresence>
                    {wishlist.length > 0 && (
                      <motion.span
                        className="nav-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        {wishlist.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Link to="/cart" className="nav-icon-link">
                  <FaShoppingCart className="nav-icon" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        className="nav-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
              {isCustomer ? (
                <div className="nav-dropdown" ref={dropdownRef}>
                  <motion.button
                    className="nav-user-btn"
                    onClick={handleProfileClick}
                    aria-haspopup="true"
                    aria-expanded={profileOpen}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="nav-avatar">{customer?.name?.[0]?.toUpperCase() || 'U'}</span>
                    <span className="nav-username">{customer?.name?.split(' ')[0]}</span>
                  </motion.button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        className="dropdown-menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link to="/profile" onClick={() => setProfileOpen(false)}>My Profile</Link>
                        <Link to="/orders" onClick={() => setProfileOpen(false)}>My Orders</Link>
                        <Link to="/wishlist" onClick={() => setProfileOpen(false)}>My Wishlist</Link>
                        <hr />
                        <button onClick={() => { logoutCustomer(); setProfileOpen(false); navigate('/'); }}>Logout</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/login" className="nav-login-btn">Login</Link>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            className="nav-search-popover"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <form className="nav-search" onSubmit={handleSearch}>
              <input placeholder="Search for products, brands and more..." value={query} onChange={e => setQuery(e.target.value)} />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ⌕
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
