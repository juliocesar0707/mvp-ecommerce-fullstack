// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Cadastro } from '../pages/Cadastro';


// Importação das páginas (vamos criar na Fase 5, por enquanto são componentes vazios)
const Home = () => <div>Página Home (Catálogo)</div>;
const ProductDetails = () => <div>Detalhes do Produto</div>;
const Cart = () => <div>Carrinho de Compras</div>;
const Checkout = () => <div>Página de Checkout</div>;
const Login = () => <div>Página de Login</div>;

// Componente para proteger rotas
const PrivateRoute = ({ children }) => {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) return <div>Carregando...</div>;
  if (!authenticated) return <Navigate to="/login" />;

  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/produto/:id" element={<ProductDetails />} />
      <Route path="/carrinho" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Rotas Privadas */}
      <Route 
        path="/checkout" 
        element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};