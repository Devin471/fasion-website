/* ─── Cart Context ─────────────────────────────────── */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isCustomer } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isCustomer) { setCart(JSON.parse(localStorage.getItem('guestCart') || '{"items":[]}')); return; }
    try { setLoading(true); const { data } = await api.get('/api/cart'); setCart(data); }
    catch {} finally { setLoading(false); }
  }, [isCustomer]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isCustomer) {
      const guest = JSON.parse(localStorage.getItem('guestCart') || '{"items":[]}');
      const idx = guest.items.findIndex(i => (i.product?._id || i.product) === productId);
      if (idx > -1) guest.items[idx].quantity += quantity;
      else guest.items.push({ product: productId, quantity });
      localStorage.setItem('guestCart', JSON.stringify(guest));
      setCart(guest);
      console.log('Guest cart updated:', guest);
      return guest;
    }
    try {
      console.log('Adding to cart - productId:', productId, 'quantity:', quantity);
      const { data } = await api.post('/api/cart', { productId, quantity });
      console.log('Cart response:', data);
      setCart(data);
      return data;
    } catch (error) {
      console.error('API Error adding to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isCustomer) return;
    try { const { data } = await api.put(`/api/cart/${itemId}`, { quantity }); setCart(data); } catch {}
  };

  const removeItem = async (itemId) => {
    if (!isCustomer) { const g = { ...cart, items: cart.items.filter((_, i) => i.toString() !== itemId) }; localStorage.setItem('guestCart', JSON.stringify(g)); setCart(g); return; }
    try { const { data } = await api.delete(`/api/cart/${itemId}`); setCart(data); } catch {}
  };

  const clearCart = async () => {
    if (!isCustomer) { localStorage.removeItem('guestCart'); setCart({ items: [] }); return; }
    try { await api.delete('/api/cart'); setCart({ items: [] }); } catch {}
  };

  const cartCount = cart.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, loading, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
