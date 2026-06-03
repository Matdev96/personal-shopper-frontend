import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Sobre */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Personal Shopper</h3>
            <p className="text-sm leading-relaxed">
              Sua loja de produtos importados dos EUA. Qualidade, variedade e entrega rápida.
            </p>
          </div>

          {/* Links Úteis */}
          <div>
            <h4 className="text-white font-bold mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Carrinho
                </Link>
              </li>
            </ul>
          </div>

          {/* Conta */}
          <div>
            <h4 className="text-white font-bold mb-4">Conta</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Registrar
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Meus Pedidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-white font-bold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: contato@personalshopper.com</li>
              <li>Telefone: (11) 99999-9999</li>
              <li>Endereço: São Paulo, SP</li>
            </ul>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-700 pt-8">
          {/* Redes Sociais */}
          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 002.856-3.51 10 10 0 01-2.856.175 10 10 0 00-7.737-3.25c-4.247 0-7.7 3.453-7.7 7.7 0 .603.063 1.194.19 1.772A28.56 28.56 0 011.525 1.525a10 10 0 003.476 5.482c-.005-.17-.005-.34 0-.51a10 10 0 008.174-9.81 10 10 0 002.856 3.51 10 10 0 01-2.856-.175 10 10 0 007.737 3.25c4.247 0 7.7-3.453 7.7-7.7 0-.603-.063-1.194-.19-1.772z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM9.5 15.5v-7l6 3.5-6 3.5z" />
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-500">
            <p>&copy; {currentYear} Personal Shopper. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}