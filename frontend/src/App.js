/* ─── App.js — Main Router with Animations ─────────────────────────── */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

/* ── Loading Fallback ── */
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <div style={{ fontSize: '14px', color: '#999' }}>Loading...</div>
  </div>
);

/* ── Pages — Lazy Loaded ── */
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Payment = lazy(() => import('./pages/Payment'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const CustomerLogin = lazy(() => import('./pages/CustomerLogin'));
const CustomerRegister = lazy(() => import('./pages/CustomerRegister'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Contact = lazy(() => import('./pages/Contact'));

const SellerLogin = lazy(() => import('./pages/SellerLogin'));
const SellerRegister = lazy(() => import('./pages/SellerRegister'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));

const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const About = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));

/* ── Route Guards ── */
function ProtectedCustomer({ children }) {
  const { isCustomer } = useAuth();
  return isCustomer ? children : <Navigate to="/login" />;
}
function ProtectedSeller({ children }) {
  const { isSeller } = useAuth();
  return isSeller ? children : <Navigate to="/seller/login" />;
}
function ProtectedAdmin({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/admin/login" />;
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="main-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Suspense fallback={<PageLoader />}>
            <Routes location={location}>
            {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:category" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/login" element={<CustomerLogin />} />
              <Route path="/register" element={<CustomerRegister />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />

            {/* Customer Protected */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<ProtectedCustomer><Checkout /></ProtectedCustomer>} />
            <Route path="/payment" element={<ProtectedCustomer><Payment /></ProtectedCustomer>} />
            <Route path="/order-confirmation/:id" element={<ProtectedCustomer><OrderConfirmation /></ProtectedCustomer>} />
            <Route path="/profile" element={<ProtectedCustomer><Profile /></ProtectedCustomer>} />
            <Route path="/orders" element={<ProtectedCustomer><OrderHistory /></ProtectedCustomer>} />
            <Route path="/wishlist" element={<ProtectedCustomer><Wishlist /></ProtectedCustomer>} />

            {/* Seller */}
            <Route path="/seller/login" element={<SellerLogin />} />
            <Route path="/seller/register" element={<SellerRegister />} />
            <Route path="/seller/*" element={<ProtectedSeller><SellerDashboard /></ProtectedSeller>} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />

            {/* 404 */}
            <Route path="*" element={
              <motion.div
                className="page-404"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1>404</h1>
                <p>Page not found</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </motion.div>
            } />
          </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
