import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useProductStore from '../store/productStore';
import useCategoryStore from '../store/categoryStore';
import useAuthStore from '../store/authStore';

export default function Home() {
  const { products, fetchProducts, isLoading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { user } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Carregar categorias
    fetchCategories();
    // Carregar produtos
    fetchProducts({ limit: 12 });
  }, []);

  const handleCategoryFilter = async (categoryId) => {
    setSelectedCategory(categoryId);
    try {
      if (categoryId) {
        await useProductStore.getState().filterByCategory(categoryId, { limit: 12 });
      } else {
        await fetchProducts({ limit: 12 });
      }
    } catch (error) {
      toast.error('Erro ao filtrar produtos');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Personal Shopper
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Encontre os melhores produtos importados dos EUA
          </p>
          {!user && (
            <div className="space-x-4">
              <Link
                to="/login"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="inline-block bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Registrar
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Categorias */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Botão "Todas as Categorias" */}
            <button
              onClick={() => handleCategoryFilter(null)}
              className={`p-4 rounded-lg font-semibold transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-300 hover:border-blue-600'
              }`}
            >
              Todas
            </button>

            {/* Categorias */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`p-4 rounded-lg font-semibold transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-300 hover:border-blue-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Produtos */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Produtos</h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Imagem do Produto */}
                  <div className="w-full h-48 bg-gray-200 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  {/* Informações do Produto */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Preço e Estoque */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-blue-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded ${
                          product.stock > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque'}
                      </span>
                    </div>

                    {/* Informações Adicionais */}
                    <div className="text-sm text-gray-600 mb-3">
                      {product.color && <p>Cor: {product.color}</p>}
                      {product.size && <p>Tamanho: {product.size}</p>}
                    </div>

                    {/* Botão Ver Detalhes */}
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Ver Detalhes
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}