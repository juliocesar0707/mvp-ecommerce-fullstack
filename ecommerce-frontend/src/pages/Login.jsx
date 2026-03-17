import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { email, senha });
      login(response.data.usuario, response.data.token);
      navigate('/checkout');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex justify-center items-center px-4 py-12 w-full">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">Bem-vindo de volta</h2>
        
        {erro && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-semibold text-center border border-red-200">
            {erro}
          </div>
        )}

        <div className="space-y-5">
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
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full text-white p-3 rounded-lg font-bold text-lg mt-8 transition-all shadow-md hover:shadow-lg
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
        >
          {loading ? 'Entrando...' : 'Acessar Conta'}
        </button>

        <p className="mt-8 text-center text-sm text-gray-600">
          Não tem uma conta? <Link to="/cadastro" className="text-blue-600 font-bold hover:underline">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
};