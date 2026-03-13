import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useOrderStore from '../store/orderStore';
import useAuthStore from '../store/authStore';

export default function Orders() {
  const navigate = useNavigate();
  const { orders, fetchOrders, cancelOrder, filterByStatus, isLoading } = useOrderStore();
  const { user } = useAuthStore();
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const handleStatusFilter = async (status) => {
    setSelectedStatus(status);
    try {
      if (status) {
        await filterByStatus(status);
      } else {
        await fetchOrders();
      }
    } catch (error) {
      toast.error('Erro ao filtrar pedidos');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
      try {
        await cancelOrder(orderId);
        toast.success('Pedido cancelado com sucesso!');
      } catch (error) {
        toast.error(error.detail || 'Erro ao cancelar pedido');
      }
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Home
          </Link>
          <span className="text-gray-600 mx-2">/</span>
          <span className="text-gray-900 font-semibold">Meus Pedidos</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Meus Pedidos</h1>

        {/* Filtros de Status */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Status</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleStatusFilter(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedStatus === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => handleStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedStatus === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              Pendente
            </button>
            <button
              onClick={() => handleStatusFilter('processing')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedStatus === 'processing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              Processando
            </button>
            <button
              onClick={() => handleStatusFilter('shipped')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedStatus === 'shipped'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              }`}
            >
              Enviado
            </button>
            <button
              onClick={() => handleStatusFilter('delivered')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedStatus === 'delivered'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Entregue
            </button>
            <button
              onClick={() => handleStatusFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedStatus === 'cancelled'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              Cancelado
            </button>
          </div>
        </div>

        {/* Lista de Pedidos */}
        {orders.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nenhum pedido encontrado</h2>
            <p className="text-gray-600 mb-8">Você ainda não fez nenhum pedido. Comece a comprar agora!</p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Cabeçalho do Pedido */}
                <div className="bg-gray-50 p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Pedido #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-lg font-semibold text-center ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                {/* Itens do Pedido */}
                <div className="p-6 border-b">
                  <h4 className="font-semibold text-gray-900 mb-4">Itens do Pedido</h4>
                  <div className="space-y-3">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.product?.name || 'Produto'}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantidade: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            R$ {(item.price_at_time * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">Sem itens neste pedido</p>
                    )}
                  </div>
                </div>

                {/* Informações de Entrega e Total */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Endereço de Entrega */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Endereço de Entrega</h4>
                    <p className="text-gray-600 text-sm">
                      {order.shipping_address || 'Não informado'}
                    </p>
                  </div>

                  {/* Método de Pagamento */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Método de Pagamento</h4>
                    <p className="text-gray-600 text-sm">
                      {order.payment_method || 'Não informado'}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="text-right">
                    <h4 className="font-semibold text-gray-900 mb-2">Total do Pedido</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      R$ {order.total_price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="bg-gray-50 p-6 border-t flex flex-col md:flex-row gap-3">
                  <Link
                    to={`/orders/${order.id}`}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                  >
                    Ver Detalhes
                  </Link>

                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Cancelar Pedido
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold cursor-default">
                      ✓ Entregue
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}