import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });

  const refreshCart = useCallback(async () => {
    if (!user) return;
    const res = await api.get('/cart');
    setCart(res.data.cart);
  }, [user]);

  useEffect(() => {
    if (user) refreshCart();
    else setCart({ items: [] });
  }, [user, refreshCart]);

  const addItem = async (productId, quantity = 1) => {
    const res = await api.post('/cart/items', { productId, quantity });
    setCart(res.data.cart);
  };

  const updateItem = async (productId, quantity) => {
    const res = await api.put(`/cart/items/${productId}`, { quantity });
    setCart(res.data.cart);
  };

  const removeItem = async (productId) => {
    const res = await api.delete(`/cart/items/${productId}`);
    setCart(res.data.cart);
  };

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, updateItem, removeItem, refreshCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
