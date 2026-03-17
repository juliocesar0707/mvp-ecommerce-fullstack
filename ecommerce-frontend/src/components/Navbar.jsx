// src/components/Navbar.jsx
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';

export const Navbar = () => {
  const { cartItemCount } = useContext(CartContext);
  const { authenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wider">MVP E-commerce</Link>
        
        <div className="flex gap-6 items-center">
          <Link to="/carrinho" className="relative hover:text-blue-200">
            Carrinho
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          {authenticated ? (
            <button onClick={handleLogout} className="hover:text-red-300">Sair</button>
          ) : (
            <Link to="/login" className="hover:text-blue-200">Entrar</Link>
          )}
        </div>
      </div>
    </nav>
  );
};