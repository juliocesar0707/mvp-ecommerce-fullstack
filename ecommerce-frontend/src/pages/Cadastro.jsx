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
    e.preventDefault();
    setErro('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem!');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/registrar', { nome, email, senha, role: 'CLIENTE' });
      alert('Cadastro realizado com sucesso! Faça seu login.');
      navigate('/login');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // O flex-grow aqui trabalha junto com o App.jsx para cravar no meio da tela
    <div className="flex-grow flex justify-center items-center px-4 py-12 w-full">
      <form onSubmit={handleCadastro} className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">Criar Conta</h2>
        
        {erro && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-semibold text-center border border-red-200">
            {erro}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo</label>
            <input type="text" required
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
              onChange={(e) => setNome(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
            <input type="email" required
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
            <input type="password" required
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
              onChange={(e) => setSenha(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirme sua Senha</label>
            <input type="password" required
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
              onChange={(e) => setConfirmarSenha(e.target.value)} 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full text-white p-3 rounded-lg font-bold text-lg mt-8 transition-all shadow-md hover:shadow-lg
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
        >
          {loading ? 'Processando...' : 'Finalizar Cadastro'}
        </button>

        <p className="mt-8 text-center text-sm text-gray-600">
          Já tem uma conta? <Link to="/login" className="text-blue-600 font-bold hover:underline">Faça login</Link>
        </p>
      </form>
    </div>
  );
};