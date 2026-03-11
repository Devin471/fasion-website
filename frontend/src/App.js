/* ─── App.js — Main Router ─────────────────────────── */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

/* ── Pages — Lazy ── */
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import SearchResults from './pages/SearchResults';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import OrderConfirmation from './pages/OrderConfirmation';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';

import SellerLogin from './pages/SellerLogin';
import SellerRegister from './pages/SellerRegister';
import SellerDashboard from './pages/SellerDashboard';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import About from './pages/About';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

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
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
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
            <div className="page-404">
              <h1>404</h1>
              <p>Page not found</p>
              <a href="/" className="btn btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
