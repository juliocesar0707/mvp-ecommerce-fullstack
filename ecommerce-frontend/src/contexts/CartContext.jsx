// src/contexts/CartContext.jsx
import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Inicializa o carrinho com dados do localStorage, se existirem
    const storedCart = localStorage.getItem('@Ecom:cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Sempre que o carrinho mudar, atualiza o localStorage
  useEffect(() => {
    localStorage.setItem('@Ecom:cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (produto) => {
    setCart((prevCart) => {
      const itemExists = prevCart.find((item) => item.id === produto.id);
      
      if (itemExists) {
        // Se já existe, apenas incrementa a quantidade (respeitando o estoque)
        return prevCart.map((item) =>
          item.id === produto.id && item.quantidade < produto.estoque
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      
      // Se não existe, adiciona o produto com quantidade 1
      return [...prevCart, { ...produto, quantidade: 1 }];
    });
  };

  const removeFromCart = (produtoId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== produtoId));
  };

  const updateQuantity = (produtoId, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === produtoId) {
          const newQuantity = item.quantidade + amount;
          // Evita quantidades negativas/zero e verifica o limite de estoque
          if (newQuantity > 0 && newQuantity <= item.estoque) {
            return { ...item, quantidade: newQuantity };
          }
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  // Deriva o subtotal a partir do estado atual do carrinho
  const cartTotal = cart.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantidade, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};