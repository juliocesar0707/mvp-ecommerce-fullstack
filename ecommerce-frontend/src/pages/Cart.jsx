// src/pages/Cart.jsx
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center mt-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Seu carrinho está vazio.</h2>
        <Link to="/" className="text-blue-600 hover:underline">Voltar para a loja</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Carrinho de Compras</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4 mb-4 last:border-0">
            <div className="flex items-center gap-4">
              <img src={item.imagem_url || 'https://via.placeholder.com/50'} alt={item.nome} className="w-16 h-16 object-cover rounded" />
              <div>
                <h3 className="font-semibold text-gray-800">{item.nome}</h3>
                <p className="text-sm text-gray-500">R$ {parseFloat(item.preco).toFixed(2)} unit.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded">
                <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">-</button>
                <span className="px-4">{item.quantidade}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">+</button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm">Remover</button>
            </div>
          </div>
        ))}
        
        <div className="mt-6 flex justify-between items-center border-t pt-4">
          <span className="text-xl font-bold text-gray-800">Total:</span>
          <span className="text-2xl font-bold text-blue-600">R$ {cartTotal.toFixed(2)}</span>
        </div>
        
        <button 
          onClick={() => navigate('/checkout')}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition font-bold text-lg"
        >
          Avançar para Checkout
        </button>
      </div>
    </div>
  );
};