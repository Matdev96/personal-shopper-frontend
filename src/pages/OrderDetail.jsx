import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useOrderStore from '../store/orderStore';
import useAuthStore from '../store/authStore';

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchOrderDetail();
  }, [orderId, user]);

  const fetchOrderDetail = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar pedido');
      }

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      toast.error('Erro ao carregar detalhes do pedido');
      navigate('/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: 'Pendente',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    };
    return statusLabels[status] || status;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pedido não encontrado</h1>
          <Link to="/orders" className="text-blue-600 hover:text-blue-700">
            Voltar para Meus Pedidos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Home
          </Link>
          <span className="text-gray-600 mx-2">/</span>
          <Link to="/orders" className="text-blue-600 hover:text-blue-700">
            Meus Pedidos
          </Link>
          <span className="text-gray-600 mx-2">/</span>
          <span className="text-gray-900 font-semibold">Pedido #{order.id}</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Detalhes do Pedido</h1>

        {/* Informações Principais */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Número do Pedido</h3>
              <p className="text-2xl font-bold text-gray-900">#{order.id}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Data do Pedido</h3>
              <p className="text-lg text-gray-900">
                {new Date(order.created_at).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Status</h3>
              <span className={`inline-block px-4 py-2 rounded-lg font-semibold ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Itens do Pedido */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Itens do Pedido</h2>

          <div className="space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-4 border-b last:border-b-0">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.product?.name || 'Produto'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quantidade: {item.quantity} × R$ {item.price_at_time.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    R$ {(item.price_at_time * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Sem itens neste pedido</p>
            )}
          </div>
        </div>

        {/* Informações de Entrega e Pagamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Endereço de Entrega */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Endereço de Entrega</h2>
            <p className="text-gray-600">
              {order.shipping_address || 'Não informado'}
            </p>
          </div>

          {/* Método de Pagamento */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Método de Pagamento</h2>
            <p className="text-gray-600">
              {order.payment_method || 'Não informado'}
            </p>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo Financeiro</h2>

          <div className="space-y-3 mb-6 pb-6 border-b">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>R$ {order.total_price.toFixed(2)}</span>
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

          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-3xl font-bold text-blue-600">
              R$ {order.total_price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <Link
            to="/orders"
            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center"
          >
            Voltar para Pedidos
          </Link>
          <Link
            to="/"
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}