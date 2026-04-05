import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useProductStore from '../store/productStore';
import useCategoryStore from '../store/categoryStore';

export default function Products() {
  const { products, fetchProducts, searchProducts, filterByCategory, filterByPrice, isLoading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    fetchCategories();
    fetchProducts({ limit: pageSize });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(0);
    
    if (!searchTerm.trim()) {
      await fetchProducts({ limit: pageSize });
      return;
    }

    try {
      await searchProducts(searchTerm, { limit: pageSize });
    } catch (error) {
      toast.error('Erro ao buscar produtos');
    }
  };

  const handleCategoryFilter = async (categoryId) => {
    setCurrentPage(0);
    setSelectedCategory(categoryId);
    
    try {
      if (categoryId) {
        await filterByCategory(categoryId, { limit: pageSize });
      } else {
        await fetchProducts({ limit: pageSize });
      }
    } catch (error) {
      toast.error('Erro ao filtrar por categoria');
    }
  };

  const handlePriceFilter = async () => {
    setCurrentPage(0);
    
    try {
      await filterByPrice(priceRange.min, priceRange.max, { limit: pageSize });
    } catch (error) {
      toast.error('Erro ao filtrar por preço');
    }
  };

  const handleStockFilter = async () => {
    setCurrentPage(0);
    setInStockOnly(!inStockOnly);
    
    try {
      if (!inStockOnly) {
        await useProductStore.getState().filterInStock({ limit: pageSize });
      } else {
        await fetchProducts({ limit: pageSize });
      }
    } catch (error) {
      toast.error('Erro ao filtrar por estoque');
    }
  };

  const handleSort = async (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(0);
    
    try {
      await fetchProducts({
        limit: pageSize,
        sort_by: field,
        sort_order: order,
      });
    } catch (error) {
      toast.error('Erro ao ordenar produtos');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Home
          </Link>
          <span className="text-gray-600 mx-2">/</span>
          <span className="text-gray-900 font-semibold">Produtos</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Todos os Produtos</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de Filtros */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Filtros</h2>

              {/* Busca */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Buscar</h3>
                <form onSubmit={handleSearch}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nome do produto..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🔍
                    </button>
                  </div>
                </form>
              </div>

              {/* Categorias */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold text-gray-900 mb-3">Categorias</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryFilter(null)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === null
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Todas
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryFilter(category.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Faixa de Preço */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold text-gray-900 mb-3">Faixa de Preço</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Mínimo: R$ {priceRange.min}</label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Máximo: R$ {priceRange.max}</label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <button
                    onClick={handlePriceFilter}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Aplicar Filtro
                  </button>
                </div>
              </div>

              {/* Estoque */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={handleStockFilter}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-gray-700 font-semibold">Apenas em Estoque</span>
                </label>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            {/* Ordenação */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-gray-600">
                Mostrando <span className="font-semibold">{products.length}</span> produtos
              </p>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value, sortOrder)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="created_at">Mais Recentes</option>
                  <option value="price">Preço</option>
                  <option value="name">Nome</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => handleSort(sortBy, e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="desc">Decrescente</option>
                  <option value="asc">Crescente</option>
                </select>
              </div>
            </div>

            {/* Grid de Produtos */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">Nenhum produto encontrado com os filtros selecionados</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Imagem */}
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

                      {/* Informações */}
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
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              product.stock > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.stock > 0 ? 'Em estoque' : 'Fora de estoque'}
                          </span>
                        </div>

                        {/* Categoria */}
                        {product.category?.name && (
                          <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mb-3">
                            {product.category.name}
                          </span>
                        )}

                        {/* Especificações */}
                        <div className="text-sm text-gray-600 mb-3">
                          {product.color && <p>Cor: {product.color}</p>}
                          {product.size && <p>Tamanho: {product.size}</p>}
                        </div>

                        {/* Botão */}
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                          Ver Detalhes
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Paginação */}
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    ← Anterior
                  </button>
                  <span className="px-4 py-2 text-gray-700 font-semibold">
                    Página {currentPage + 1}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={products.length < pageSize}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    Próxima →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}