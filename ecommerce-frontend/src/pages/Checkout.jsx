// src/pages/Checkout.jsx
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { api } from '../services/api';

export const Checkout = () => {
  const { cart, cartTotal, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleFinalizarCompra = async () => {
    setLoading(true);
    setErro('');

    try {
      // Mapeia o carrinho para o formato esperado pela API
      const itens = cart.map(item => ({
        produto_id: item.id,
        quantidade: item.quantidade
      }));

      await api.post('/pedidos/checkout', { itens });
      
      clearCart();
      alert('Pedido realizado com sucesso!');
      navigate('/'); // Redireciona para home ou tela de "Sucesso"
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao processar o pagamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Revisão do Pedido</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <ul className="mb-6 space-y-2">
          {cart.map(item => (
            <li key={item.id} className="flex justify-between text-gray-700">
              <span>{item.quantidade}x {item.nome}</span>
              <span>R$ {(item.quantidade * item.preco).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        
        <div className="flex justify-between items-center border-t pt-4 mb-6">
          <span className="text-xl font-bold">Total a Pagar:</span>
          <span className="text-2xl font-bold text-green-600">R$ {cartTotal.toFixed(2)}</span>
        </div>

        {erro && <p className="text-red-500 mb-4 text-center font-medium">{erro}</p>}

        <button 
          onClick={handleFinalizarCompra}
          disabled={loading || cart.length === 0}
          className={`w-full text-white py-3 rounded-md transition font-bold text-lg 
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Processando transação...' : 'Confirmar e Pagar'}
        </button>
      </div>
    </div>
  );
};