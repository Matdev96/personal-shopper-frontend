import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          🛍️ Personal Shopper
        </Link>
        
        <div className="flex gap-6">
          <Link to="/" className="hover:text-blue-200">
            Home
          </Link>
          <Link to="/products" className="hover:text-blue-200">
            Produtos
          </Link>
          
          {user ? (
            <>
              <span className="text-sm">Olá, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-200">
                Registrar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}