import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bem-vindo ao Personal Shopper
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sua plataforma de compras inteligente e personalizada
          </p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block"
          >
            Explorar Produtos
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="text-xl font-bold mb-2">Produtos Variados</h3>
            <p className="text-gray-600">
              Encontre uma grande variedade de produtos de qualidade.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-bold mb-2">Pagamento Seguro</h3>
            <p className="text-gray-600">
              Suas transações são protegidas com criptografia de ponta.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2">Entrega Rápida</h3>
            <p className="text-gray-600">
              Receba seus pedidos rapidamente em sua casa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}