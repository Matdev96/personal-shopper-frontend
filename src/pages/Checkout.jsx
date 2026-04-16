import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useCartStore from '../store/cartStore';
import useOrderStore from '../store/orderStore';
import useAuthStore from '../store/authStore';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const { createOrder, isLoading } = useOrderStore();
  const { user } = useAuthStore();

  const hasSavedAddress = !!(user?.logradouro && user?.cidade);
  const userPrefersPickup = user?.retirar_na_loja === true;

  // Modo de entrega: 'saved' | 'new' | 'pickup'
  const getInitialMode = () => {
    if (userPrefersPickup) return 'pickup';
    if (hasSavedAddress) return 'saved';
    return 'new';
  };

  const [deliveryMode, setDeliveryMode] = useState(getInitialMode);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cepLoading, setCepLoading] = useState(false);

  const [newAddress, setNewAddress] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [user, items]);

  const handleNewAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleCepBlur = async () => {
    const cep = newAddress.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }

      setNewAddress((prev) => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
      }));
    } catch {
      toast.error('Erro ao buscar CEP');
    } finally {
      setCepLoading(false);
    }
  };

  const validateNewAddress = () => {
    const newErrors = {};
    if (!newAddress.logradouro) newErrors.logradouro = 'Rua é obrigatória';
    if (!newAddress.numero) newErrors.numero = 'Número é obrigatório';
    if (!newAddress.cidade) newErrors.cidade = 'Cidade é obrigatória';
    if (!newAddress.estado) newErrors.estado = 'Estado é obrigatório';
    if (!newAddress.cep) newErrors.cep = 'CEP é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildShippingAddress = () => {
    if (deliveryMode === 'pickup') return 'Retirar na Loja';

    if (deliveryMode === 'saved') {
      const parts = [
        `${user.logradouro}, ${user.numero}`,
        user.complemento,
        user.bairro,
        `${user.cidade}/${user.estado}`,
        user.cep ? `CEP ${user.cep}` : '',
      ].filter(Boolean);
      return parts.join(' - ');
    }

    const parts = [
      `${newAddress.logradouro}, ${newAddress.numero}`,
      newAddress.complemento,
      newAddress.bairro,
      `${newAddress.cidade}/${newAddress.estado}`,
      newAddress.cep ? `CEP ${newAddress.cep}` : '',
    ].filter(Boolean);
    return parts.join(' - ');
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (deliveryMode === 'new' && !validateNewAddress()) {
      toast.error('Preencha o endereço de entrega corretamente');
      return;
    }

    try {
      const orderData = {
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        shipping_address: buildShippingAddress(),
        payment_method: paymentMethod,
      };

      const response = await createOrder(orderData);
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
          <Link to="/" className="text-blue-600 hover:text-blue-700">Home</Link>
          <span className="text-gray-600 mx-2">/</span>
          <Link to="/cart" className="text-blue-600 hover:text-blue-700">Carrinho</Link>
          <span className="text-gray-600 mx-2">/</span>
          <span className="text-gray-900 font-semibold">Checkout</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <form onSubmit={onSubmit} className="space-y-8">
              {/* Informações Pessoais */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações Pessoais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                    <input
                      type="text"
                      value={user?.full_name || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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

                {/* Seletor de modo */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {hasSavedAddress && (
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('saved')}
                      className={`flex-1 min-w-[140px] py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-colors ${
                        deliveryMode === 'saved'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      Usar endereço salvo
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('new')}
                    className={`flex-1 min-w-[140px] py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-colors ${
                      deliveryMode === 'new'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Informar outro endereço
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('pickup')}
                    className={`flex-1 min-w-[140px] py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-colors ${
                      deliveryMode === 'pickup'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    Retirar na Loja
                  </button>
                </div>

                {/* Endereço salvo */}
                {deliveryMode === 'saved' && hasSavedAddress && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-green-800 mb-1">Entrega para:</p>
                    <p className="text-sm text-green-700">
                      {user.logradouro}, {user.numero}
                      {user.complemento ? ` - ${user.complemento}` : ''}
                    </p>
                    <p className="text-sm text-green-700">
                      {user.bairro && `${user.bairro} — `}{user.cidade}/{user.estado}
                      {user.cep ? ` — CEP ${user.cep}` : ''}
                    </p>
                    <Link
                      to="/profile"
                      className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                    >
                      Alterar endereço salvo no perfil
                    </Link>
                  </div>
                )}

                {/* Retirar na loja */}
                {deliveryMode === 'pickup' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-800">Você retirará o pedido na loja.</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Entraremos em contato para combinar a retirada.
                    </p>
                  </div>
                )}

                {/* Novo endereço manual */}
                {deliveryMode === 'new' && (
                  <div className="space-y-4">
                    {/* CEP */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          name="cep"
                          value={newAddress.cep}
                          onChange={handleNewAddressChange}
                          onBlur={handleCepBlur}
                          maxLength={9}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                            errors.cep ? 'border-red-400' : 'border-gray-300'
                          }`}
                          placeholder="00000-000"
                        />
                        {cepLoading && (
                          <span className="text-sm text-blue-600 whitespace-nowrap">Buscando...</span>
                        )}
                      </div>
                      {errors.cep && <p className="mt-1 text-sm text-red-600">{errors.cep}</p>}
                    </div>

                    {/* Logradouro */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rua / Avenida</label>
                      <input
                        type="text"
                        name="logradouro"
                        value={newAddress.logradouro}
                        onChange={handleNewAddressChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                          errors.logradouro ? 'border-red-400' : 'border-gray-300'
                        }`}
                        placeholder="Rua das Flores"
                      />
                      {errors.logradouro && <p className="mt-1 text-sm text-red-600">{errors.logradouro}</p>}
                    </div>

                    {/* Número e Complemento */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                        <input
                          type="text"
                          name="numero"
                          value={newAddress.numero}
                          onChange={handleNewAddressChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                            errors.numero ? 'border-red-400' : 'border-gray-300'
                          }`}
                          placeholder="123"
                        />
                        {errors.numero && <p className="mt-1 text-sm text-red-600">{errors.numero}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Complemento <span className="text-gray-400 font-normal">(opcional)</span>
                        </label>
                        <input
                          type="text"
                          name="complemento"
                          value={newAddress.complemento}
                          onChange={handleNewAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder="Apto 12"
                        />
                      </div>
                    </div>

                    {/* Bairro */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                      <input
                        type="text"
                        name="bairro"
                        value={newAddress.bairro}
                        onChange={handleNewAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Centro"
                      />
                    </div>

                    {/* Cidade e Estado */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                        <input
                          type="text"
                          name="cidade"
                          value={newAddress.cidade}
                          onChange={handleNewAddressChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                            errors.cidade ? 'border-red-400' : 'border-gray-300'
                          }`}
                          placeholder="São Paulo"
                        />
                        {errors.cidade && <p className="mt-1 text-sm text-red-600">{errors.cidade}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado (UF)</label>
                        <input
                          type="text"
                          name="estado"
                          value={newAddress.estado}
                          onChange={handleNewAddressChange}
                          maxLength={2}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                            errors.estado ? 'border-red-400' : 'border-gray-300'
                          }`}
                          placeholder="SP"
                        />
                        {errors.estado && <p className="mt-1 text-sm text-red-600">{errors.estado}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Método de Pagamento */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Método de Pagamento</h2>
                <div className="space-y-3">
                  {[
                    { value: 'credit_card', label: 'Cartão de Crédito' },
                    { value: 'debit_card', label: 'Cartão de Débito' },
                    { value: 'pix', label: 'PIX' },
                    { value: 'bank_transfer', label: 'Transferência Bancária' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        value={option.value}
                        checked={paymentMethod === option.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700 font-semibold">{option.label}</span>
                    </label>
                  ))}
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

              <div className="mb-6 pb-6 border-b max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">{item.product?.name || 'Produto'}</p>
                      <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      R$ {(item.price_at_time * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

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

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-blue-600">
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">✓ Seus dados estão seguros e criptografados</p>
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
