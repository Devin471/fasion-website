/* ─── Wishlist Context ─────────────────────────────── */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isCustomer } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = useCallback(async () => {
    if (!isCustomer) { setWishlist([]); return; }
    try { const { data } = await api.get('/wishlist'); setWishlist(data.products || []); } catch {}
  }, [isCustomer]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    if (!isCustomer) return;
    try { const { data } = await api.post('/wishlist', { productId }); setWishlist(data.products || []); } catch {}
  };

  const removeFromWishlist = async (productId) => {
    if (!isCustomer) return;
    try { const { data } = await api.delete(`/wishlist/${productId}`); setWishlist(data.products || []); } catch {}
  };

  const isInWishlist = (productId) => wishlist.some(p => (p._id || p) === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
