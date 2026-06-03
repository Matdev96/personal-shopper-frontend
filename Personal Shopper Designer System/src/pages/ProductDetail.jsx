import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useProductStore from '../store/productStore';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currentProduct, fetchProductById, isLoading } = useProductStore();
  const { addItem, isLoading: cartLoading } = useCartStore();
  const { user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductById(parseInt(productId));
  }, [productId]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.warning('Você precisa estar logado para adicionar itens ao carrinho');
      navigate('/login');
      return;
    }

    if (quantity <= 0) {
      toast.error('Quantidade deve ser maior que zero');
      return;
    }

    if (!currentProduct || quantity > currentProduct.stock) {
      toast.error('Quantidade solicitada não está disponível em estoque');
      return;
    }

    try {
      await addItem(currentProduct.id, quantity);
      toast.success(`${currentProduct.name} adicionado ao carrinho!`);
      setQuantity(1);
    } catch (error) {
      toast.error(error.detail || 'Erro ao adicionar ao carrinho');
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (currentProduct?.stock || 0)) {
      setQuantity(value);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Home
          </Link>
          <span className="text-gray-600 mx-2">/</span>
          <span className="text-gray-900 font-semibold">{currentProduct.name}</span>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-md p-8">
          {/* Imagem do Produto */}
          <div className="flex items-center justify-center">
            {currentProduct.image_url ? (
              <img
                src={currentProduct.image_url}
                alt={currentProduct.name}
                className="w-full h-auto max-h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                Sem imagem disponível
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="flex flex-col justify-between">
            {/* Nome e Categoria */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {currentProduct.name}
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                Categoria: <span className="font-semibold">{currentProduct.category?.name || 'N/A'}</span>
              </p>

              {/* Descrição */}
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                {currentProduct.description}
              </p>

              {/* Especificações */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificações</h3>
                <div className="grid grid-cols-2 gap-4">
                  {currentProduct.color && (
                    <div>
                      <p className="text-gray-600 text-sm">Cor</p>
                      <p className="text-gray-900 font-semibold">{currentProduct.color}</p>
                    </div>
                  )}
                  {currentProduct.size && (
                    <div>
                      <p className="text-gray-600 text-sm">Tamanho</p>
                      <p className="text-gray-900 font-semibold">{currentProduct.size}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600 text-sm">Estoque</p>
                    <p className={`font-semibold ${currentProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {currentProduct.stock > 0 ? `${currentProduct.stock} unidades` : 'Fora de estoque'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className={`font-semibold ${currentProduct.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {currentProduct.is_active ? 'Ativo' : 'Inativo'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preço e Ações */}
            <div className="border-t pt-6">
              {/* Preço */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">Preço</p>
                <p className="text-5xl font-bold text-blue-600">
                  R$ {currentProduct.price.toFixed(2)}
                </p>
              </div>

              {/* Quantidade */}
              {currentProduct.stock > 0 && (
                <div className="mb-6">
                  <label htmlFor="quantity" className="block text-gray-700 font-semibold mb-2">
                    Quantidade
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {Array.from({ length: Math.min(currentProduct.stock, 10) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || currentProduct.stock === 0}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {cartLoading ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                </button>

                <Link
                  to="/"
                  className="block w-full bg-gray-200 text-gray-900 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
                >
                  Continuar Comprando
                </Link>
              </div>

              {/* Mensagem de Fora de Estoque */}
              {currentProduct.stock === 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-semibold">Este produto está fora de estoque</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Produtos Relacionados</h2>
          <p className="text-gray-600">
            Funcionalidade de produtos relacionados será implementada em breve.
          </p>
        </div>
      </div>
    </div>
  );
}