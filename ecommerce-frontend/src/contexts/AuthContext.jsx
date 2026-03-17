// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recupera o usuário e o token salvos ao recarregar a página
    const storedUser = localStorage.getItem('@Ecom:user');
    const storedToken = localStorage.getItem('@Ecom:token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      // Configura o Axios para enviar o token em todas as requisições futuras
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('@Ecom:user', JSON.stringify(userData));
    localStorage.setItem('@Ecom:token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@Ecom:user');
    localStorage.removeItem('@Ecom:token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ authenticated: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};