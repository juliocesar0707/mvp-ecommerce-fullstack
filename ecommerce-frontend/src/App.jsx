import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {/* Transformamos o App inteiro em uma coluna flexível */}
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            {/* O flex-grow garante que o conteúdo ocupe todo o resto da tela */}
            <main className="flex-grow flex flex-col">
              <AppRoutes />
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;