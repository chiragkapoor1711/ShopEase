"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const clearCartCount = () => {
    setCartCount(0);
  };

  async function fetchCartCount() {
    try {
      const res = await fetch("/api/cart");

      if (!res.ok) {
        setCartCount(0);
        return;
      }

      const data = await res.json();

      if (data.success) {
        const total = data.cart.reduce(
          (sum, item) => sum + Number(item.quantity),
          0,
        );

        setCartCount(total);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error(error);
      setCartCount(0);
    }
  }

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        fetchCartCount,
        clearCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
