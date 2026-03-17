// src/pages/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Como não criamos tela de registro no front, vamos assumir que o usuário 
      // já foi criado via Postman/Insomnia, ou você pode criar um registro simples depois.
      const response = await api.post('/auth/login', { email, senha });
      login(response.data.usuario, response.data.token);
      navigate('/checkout'); // Manda pro checkout se ele logou para pagar
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao fazer login');
    }
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Acesse sua conta</h2>
        <input 
          type="email" placeholder="E-mail" required
          className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" placeholder="Senha" required
          className="w-full mb-6 p-2 border rounded"
          onChange={(e) => setSenha(e.target.value)} 
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Entrar
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
            Não tem uma conta? <Link to="/cadastro" className="text-blue-600 hover:underline">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
};