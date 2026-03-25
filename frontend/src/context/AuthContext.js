/* ─── Auth Context — 3 role auth ───────────────────── */
import React, { createContext, useContext, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

function safeParse(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => safeParse('customer'));
  const [customerToken, setCustomerToken] = useState(() => localStorage.getItem('customerToken'));
  const [seller, setSeller] = useState(() => safeParse('seller'));
  const [sellerToken, setSellerToken] = useState(() => localStorage.getItem('sellerToken'));
  const [admin, setAdmin] = useState(() => safeParse('admin'));
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken'));

  /* ── Customer ── */
  const loginCustomer = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('customerToken', data.token);
      localStorage.setItem('customer', JSON.stringify(data.user));
      setCustomerToken(data.token); setCustomer(data.user);
      return data.user;
    } catch (err) {
      throw err;
    }
  };
  const registerCustomer = async (name, email, password, phone) => {
    const { data } = await api.post('/api/auth/register', { name, email, password, phone });
    localStorage.setItem('customerToken', data.token);
    localStorage.setItem('customer', JSON.stringify(data.user));
    setCustomerToken(data.token); setCustomer(data.user);
    return data.user;
  };
  const loginCustomerWithGoogle = async (accessToken) => {
    const { data } = await api.post('/api/auth/google', { accessToken, role: 'customer' });
    localStorage.setItem('customerToken', data.token);
    localStorage.setItem('customer', JSON.stringify(data.user));
    setCustomerToken(data.token); setCustomer(data.user);
    return data.user;
  };
  const logoutCustomer = () => {
    ['customerToken', 'customer'].forEach(k => localStorage.removeItem(k));
    setCustomerToken(null); setCustomer(null);
  };

  /* ── Seller ── */
  const loginSeller = async (email, password) => {
    const { data } = await api.post('/api/auth/seller/login', { email, password });
    localStorage.setItem('sellerToken', data.token);
    localStorage.setItem('seller', JSON.stringify(data.seller));
    setSellerToken(data.token); setSeller(data.seller);
    return data.seller;
  };
  const registerSeller = async (payload) => {
    const { data } = await api.post('/api/auth/seller/register', payload);
    localStorage.setItem('sellerToken', data.token);
    localStorage.setItem('seller', JSON.stringify(data.seller));
    setSellerToken(data.token); setSeller(data.seller);
    return data.seller;
  };
  const loginSellerWithGoogle = async (accessToken) => {
    const { data } = await api.post('/api/auth/google', { accessToken, role: 'seller' });
    localStorage.setItem('sellerToken', data.token);
    localStorage.setItem('seller', JSON.stringify(data.seller));
    setSellerToken(data.token); setSeller(data.seller);
    return data.seller;
  };
  const logoutSeller = () => {
    ['sellerToken', 'seller'].forEach(k => localStorage.removeItem(k));
    setSellerToken(null); setSeller(null);
  };

  /* ── Admin ── */
  const loginAdmin = async (email, password) => {
    const { data } = await api.post('/api/auth/admin/login', { email, password });
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('admin', JSON.stringify(data.admin));
    setAdminToken(data.token); setAdmin(data.admin);
    return data.admin;
  };
  const registerAdmin = async (name, email, password) => {
    const { data } = await api.post('/api/auth/admin/register', { name, email, password });
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('admin', JSON.stringify(data.admin));
    setAdminToken(data.token); setAdmin(data.admin);
    return data.admin;
  };
  const logoutAdmin = () => {
    ['adminToken', 'admin'].forEach(k => localStorage.removeItem(k));
    setAdminToken(null); setAdmin(null);
  };

  const value = {
    customer, seller, admin,
    isCustomer: !!customerToken, isSeller: !!sellerToken, isAdmin: !!adminToken,
    loginCustomer, registerCustomer, loginCustomerWithGoogle, logoutCustomer,
    loginSeller, registerSeller, loginSellerWithGoogle, logoutSeller,
    loginAdmin, registerAdmin, logoutAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
