/* ─── Auth Context — 3 role auth ───────────────────── */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [customerToken, setCustomerToken] = useState(localStorage.getItem('customerToken'));
  const [seller, setSeller] = useState(null);
  const [sellerToken, setSellerToken] = useState(localStorage.getItem('sellerToken'));
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const sc = localStorage.getItem('customer'); if (sc) setCustomer(JSON.parse(sc));
      const ss = localStorage.getItem('seller');   if (ss) setSeller(JSON.parse(ss));
      const sa = localStorage.getItem('admin');    if (sa) setAdmin(JSON.parse(sa));
    } catch {}
    setLoading(false);
  }, []);

  /* ── Customer ── */
  const loginCustomer = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('customerToken', data.token);
    localStorage.setItem('customer', JSON.stringify(data.user));
    setCustomerToken(data.token); setCustomer(data.user);
    return data.user;
  };
  const registerCustomer = async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone });
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
    const { data } = await api.post('/auth/seller/login', { email, password });
    localStorage.setItem('sellerToken', data.token);
    localStorage.setItem('seller', JSON.stringify(data.seller));
    setSellerToken(data.token); setSeller(data.seller);
    return data.seller;
  };
  const registerSeller = async (payload) => {
    const { data } = await api.post('/auth/seller/register', payload);
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
    const { data } = await api.post('/auth/admin/login', { email, password });
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('admin', JSON.stringify(data.admin));
    setAdminToken(data.token); setAdmin(data.admin);
    return data.admin;
  };
  const registerAdmin = async (name, email, password) => {
    const { data } = await api.post('/auth/admin/register', { name, email, password });
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
    customer, seller, admin, loading,
    isCustomer: !!customerToken, isSeller: !!sellerToken, isAdmin: !!adminToken,
    loginCustomer, registerCustomer, logoutCustomer,
    loginSeller, registerSeller, logoutSeller,
    loginAdmin, registerAdmin, logoutAdmin
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
