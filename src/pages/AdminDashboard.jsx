import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import useAuthStore from '../store/authStore';
import requestService from '../services/requestService';
import { STATUS_LABEL, STATUS_COLOR, formatDate } from '../utils/requestStatus';

const URGENT_STATUSES = ['aguardando_confirmacao', 'sinal_pago', 'pago'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalRequests: 0,
    pendingRequests: 0,
    urgentRequests: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      const [usersRes, productsRes, ordersRes, allRequestsRes, pendingRequestsRes] =
        await Promise.all([
          fetch('http://127.0.0.1:8000/api/v1/admin/users?skip=0&limit=100', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://127.0.0.1:8000/api/v1/products?skip=0&limit=100', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://127.0.0.1:8000/api/v1/orders?skip=0&limit=100', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          requestService.listAll({ limit: 5 }),
          requestService.listAll({ status_filter: 'pendente', limit: 100 }),
        ]);

      const usersData = usersRes.ok ? await usersRes.json() : [];
      const productsJson = productsRes.ok ? await productsRes.json() : {};
      const productsData = productsJson.items ?? productsJson ?? [];
      const ordersData = ordersRes.ok ? await ordersRes.json() : [];

      const recent = allRequestsRes.items ?? [];
      const pending = pendingRequestsRes.items ?? [];

      // Para calcular urgentes precisamos buscar todas sem filtro de status
      const urgentCount = recent.filter((r) => URGENT_STATUSES.includes(r.status)).length;

      const totalRevenue = Array.isArray(ordersData)
        ? ordersData.reduce((sum, order) => sum + (order.total || 0), 0)
        : 0;

      setStats({
        totalUsers: Array.isArray(usersData) ? usersData.length : 0,
        totalProducts: Array.isArray(productsData) ? productsData.length : 0,
        totalOrders: Array.isArray(ordersData) ? ordersData.length : 0,
        totalRevenue,
        totalRequests: allRequestsRes.total ?? recent.length,
        pendingRequests: pendingRequestsRes.total ?? pending.length,
        urgentRequests: urgentCount,
      });

      setRecentRequests(recent);
    } catch {
      // mantém zeros no erro
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats — E-commerce */}
        <p className="text-xs font-semibold uppercase text-gray-400 mb-3 tracking-wider">E-commerce</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard title="Total de Usuários" value={stats.totalUsers} icon="👥" color="border-blue-500" />
          <StatCard title="Total de Produtos" value={stats.totalProducts} icon="📦" color="border-green-500" />
          <StatCard title="Total de Pedidos" value={stats.totalOrders} icon="🛒" color="border-yellow-500" />
          <StatCard title="Receita Total" value={`R$ ${stats.totalRevenue.toFixed(2)}`} icon="💰" color="border-purple-500" />
        </div>

        {/* Stats — Solicitações */}
        <p className="text-xs font-semibold uppercase text-gray-400 mb-3 tracking-wider">Solicitações de Busca</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total de Solicitações" value={stats.totalRequests} icon="🛍️" color="border-indigo-500" />
          <StatCard title="Solicitações Pendentes" value={stats.pendingRequests} icon="🕐" color="border-orange-500" />
          <StatCard
            title="Precisam de Ação"
            value={stats.urgentRequests}
            icon="⚠️"
            color={stats.urgentRequests > 0 ? 'border-red-500' : 'border-gray-300'}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Gerenciar Usuários
            </button>
            <button
              onClick={() => navigate('/admin/products')}
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Gerenciar Produtos
            </button>
            <button
              onClick={() => navigate('/admin/requests')}
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Ver Solicitações
              {stats.pendingRequests > 0 && (
                <span className="bg-white text-orange-600 text-xs font-bold rounded-full px-2 py-0.5">
                  {stats.pendingRequests}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Voltar para Loja
            </button>
          </div>
        </div>

        {/* Solicitações Recentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Solicitações Recentes</h2>
            <Link
              to="/admin/requests"
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              Ver todas →
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">Nenhuma solicitação encontrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500 text-xs uppercase">
                    <th className="pb-3 pr-4">#</th>
                    <th className="pb-3 pr-4">Cliente</th>
                    <th className="pb-3 pr-4">Produto</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Data</th>
                    <th className="pb-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4 text-gray-400">{r.id}</td>
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-gray-800">{r.user?.full_name ?? `#${r.user_id}`}</p>
                        {r.user?.email && (
                          <p className="text-xs text-gray-400">{r.user.email}</p>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <p className="text-gray-700 truncate max-w-[180px]">{r.title}</p>
                        {r.preferred_store && (
                          <p className="text-xs text-gray-400">{r.preferred_store}</p>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[r.status]}`}>
                          {STATUS_LABEL[r.status] ?? r.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-400 text-xs">{formatDate(r.created_at)}</td>
                      <td className="py-3">
                        <Link
                          to={`/admin/requests/${r.id}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
                        >
                          Gerenciar →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
