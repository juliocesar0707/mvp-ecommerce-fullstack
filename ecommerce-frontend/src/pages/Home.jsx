// src/pages/Home.jsx
import { useState, useEffect, useContext } from 'react';
import { api } from '../services/api';
import { CartContext } from '../contexts/CartContext';

export const Home = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get('/produtos');
        setProdutos(response.data.produtos);
      } catch (error) {
        console.error("Erro ao buscar produtos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  if (loading) return <div className="text-center mt-10 text-xl">Carregando vitrine...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Nossos Produtos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {produtos.map((produto) => (
          <div key={produto.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
            <img 
              src={produto.imagem_url || 'https://via.placeholder.com/150'} 
              alt={produto.nome} 
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-700 truncate">{produto.nome}</h2>
            <p className="text-blue-600 font-bold text-xl mt-2">R$ {parseFloat(produto.preco).toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Estoque: {produto.estoque}</p>
            
            <button 
              onClick={() => addToCart(produto)}
              disabled={produto.estoque === 0}
              className={`mt-auto pt-4 ${produto.estoque === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium">
                {produto.estoque === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};