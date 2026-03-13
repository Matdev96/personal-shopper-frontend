import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useCartStore from '../store/cartStore';
import useOrderStore from '../store/orderStore';
import useAuthStore from '../store/authStore';

export default function Checkout() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { items, totalPrice, clearCart } = useCartStore();
  const { createOrder, isLoading } = useOrderStore();
  const { user } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, items]);

  const onSubmit = async (data) => {
    try {
      const orderData = {
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        shipping_address: `${data.street}, ${data.number} - ${data.city}, ${data.state} ${data.zip}`,
        payment_method: paymentMethod,
      };

      const response = await createOrder(orderData);
      
      // Limpar carrinho após criar pedido
      await clearCart();
      
      toast.success('Pedido criado com sucesso!');
      navigate(`/orders/${response.id}`);
    } catch (error) {
      toast.error(error.detail || 'Erro ao criar pedido');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Home
          </Link>
          <span className="text-gray-600 mx-2">/</span>
          <Link to="/cart" className="text-blue-600 hover:text-blue-700">
            Carrinho
          </Link>
          <span className="text-gray-600 mx-2">/</span>
          <span className="text-gray-900 font-semibold">Checkout</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Informações Pessoais */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações Pessoais</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={user?.full_name || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço de Entrega */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Endereço de Entrega</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rua
                    </label>
                    <input
                      type="text"
                      {...register('street', { required: 'Rua é obrigatória' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Rua Principal"
                    />
                    {errors.street && (
                      <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número
                      </label>
                      <input
                        type="text"
                        {...register('number', { required: 'Número é obrigatório' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="123"
                      />
                      {errors.number && (
                        <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CEP
                      </label>
                      <input
                        type="text"
                        {...register('zip', { required: 'CEP é obrigatório' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="12345-678"
                      />
                      {errors.zip && (
                        <p className="mt-1 text-sm text-red-600">{errors.zip.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        {...register('city', { required: 'Cidade é obrigatória' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="São Paulo"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                      </label>
                      <input
                        type="text"
                        {...register('state', { required: 'Estado é obrigatório' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="SP"
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Método de Pagamento */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Método de Pagamento</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700 font-semibold">Cartão de Crédito</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      value="debit_card"
                      checked={paymentMethod === 'debit_card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700 font-semibold">Cartão de Débito</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      value="pix"
                      checked={paymentMethod === 'pix'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700 font-semibold">PIX</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700 font-semibold">Transferência Bancária</span>
                  </label>
                </div>
              </div>

              {/* Botão Confirmar */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? 'Processando...' : 'Confirmar Pedido'}
              </button>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>

              {/* Itens */}
              <div className="mb-6 pb-6 border-b max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.product?.name || 'Produto'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qtd: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      R$ {(item.price_at_time * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Cálculos */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span className="text-green-600 font-semibold">Grátis</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Desconto</span>
                  <span>R$ 0,00</span>
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

              {/* Informações */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✓ Seus dados estão seguros e criptografados
                </p>
                <p className="text-sm text-blue-800 mt-2">
                  ✓ Você receberá um email de confirmação do pedido
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}