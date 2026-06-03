import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

export default function Cart() {
  const navigate = useNavigate();
  const { items, fetchCartItems, updateItem, removeItem, clearCart, totalPrice, isLoading } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCartItems();
  }, [user]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(itemId);
      return;
    }

    try {
      await updateItem(itemId, newQuantity);
      toast.success('Quantidade atualizada!');
    } catch (error) {
      toast.error(error.detail || 'Erro ao atualizar quantidade');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeItem(itemId);
      toast.success('Item removido do carrinho!');
    } catch (error) {
      toast.error(error.detail || 'Erro ao remover item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Tem certeza que deseja limpar o carrinho?')) {
      try {
        await clearCart();
        toast.success('Carrinho limpo!');
      } catch (error) {
        toast.error(error.detail || 'Erro ao limpar carrinho');
      }
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Seu carrinho está vazio');
      return;
    }
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <span className="text-gray-900 font-semibold">Carrinho</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Seu Carrinho</h1>

        {items.length === 0 ? (
          // Carrinho Vazio
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="mb-6">
              <svg
                className="w-24 h-24 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-8">Adicione alguns produtos para começar suas compras!</p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        ) : (
          // Carrinho com Itens
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de Itens */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Cabeçalho da Tabela */}
                <div className="hidden md:grid grid-cols-5 gap-4 bg-gray-100 p-4 font-semibold text-gray-900 border-b">
                  <div className="col-span-2">Produto</div>
                  <div className="text-center">Preço</div>
                  <div className="text-center">Quantidade</div>
                  <div className="text-right">Total</div>
                </div>

                {/* Itens do Carrinho */}
                <div className="divide-y">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 md:grid md:grid-cols-5 md:gap-4 md:items-center"
                    >
                      {/* Produto */}
                      <div className="col-span-2 mb-4 md:mb-0">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {item.product?.name || 'Produto'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.product?.description || 'Sem descrição'}
                        </p>
                      </div>

                      {/* Preço */}
                      <div className="text-center mb-4 md:mb-0">
                        <p className="md:hidden text-sm text-gray-600 mb-1">Preço</p>
                        <p className="font-semibold text-gray-900">
                          R$ {item.price_at_time.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantidade */}
                      <div className="mb-4 md:mb-0">
                        <p className="md:hidden text-sm text-gray-600 mb-1">Quantidade</p>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="bg-gray-200 text-gray-900 px-2 py-1 rounded hover:bg-gray-300 transition-colors"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            className="w-12 text-center border border-gray-300 rounded py-1"
                            min="1"
                          />
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="bg-gray-200 text-gray-900 px-2 py-1 rounded hover:bg-gray-300 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total e Remover */}
                      <div className="flex items-center justify-between md:justify-end gap-4">
                        <div className="text-right">
                          <p className="md:hidden text-sm text-gray-600 mb-1">Total</p>
                          <p className="font-bold text-lg text-blue-600">
                            R$ {(item.price_at_time * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão Limpar Carrinho */}
              <div className="mt-4">
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                >
                  Limpar Carrinho
                </button>
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>

                {/* Itens */}
                <div className="mb-4 pb-4 border-b">
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Subtotal ({items.length} itens)</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Frete */}
                <div className="mb-4 pb-4 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Frete</span>
                    <span className="text-green-600 font-semibold">Grátis</span>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-bold text-blue-600">
                      R$ {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Botão Checkout */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3"
                >
                  Ir para Checkout
                </button>

                {/* Botão Continuar Comprando */}
                <Link
                  to="/"
                  className="block w-full bg-gray-200 text-gray-900 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
                >
                  Continuar Comprando
                </Link>

                {/* Informações Adicionais */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-4">
                    ✓ Frete grátis em compras acima de R$ 100
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    ✓ Parcelamento em até 12x sem juros
                  </p>
                  <p className="text-sm text-gray-600">
                    ✓ Garantia de satisfação ou seu dinheiro de volta
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}