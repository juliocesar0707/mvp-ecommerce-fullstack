// src/pages/Cadastro.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault(); // Evita que a página recarregue
    setErro('');

    // Validação simples
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem!');
      return;
    }

    setLoading(true);

    try {
      // Envia os dados para a rota de registro que criamos no Node.js
      await api.post('/auth/registrar', { 
        nome, 
        email, 
        senha, 
        role: 'CLIENTE' // Forçamos para que quem se cadastre aqui seja sempre cliente
      });

      alert('Cadastro realizado com sucesso! Faça seu login.');
      navigate('/login'); // Manda o usuário para a tela de login
      
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10 mb-10">
      <form onSubmit={handleCadastro} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Criar Conta</h2>
        
        {erro && <p className="text-red-500 mb-4 text-center text-sm font-medium">{erro}</p>}

        <input 
          type="text" placeholder="Seu Nome Completo" required
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setNome(e.target.value)} 
        />
        
        <input 
          type="email" placeholder="E-mail" required
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)} 
        />
        
        <input 
          type="password" placeholder="Senha" required
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSenha(e.target.value)} 
        />

        <input 
          type="password" placeholder="Confirme sua Senha" required
          className="w-full mb-6 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setConfirmarSenha(e.target.value)} 
        />

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full text-white p-2 rounded transition font-medium
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Já tem uma conta? <Link to="/login" className="text-blue-600 hover:underline">Faça login aqui</Link>
        </p>
      </form>
    </div>
  );
};