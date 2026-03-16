import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import useAuthStore from '../store/authStore';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
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

    // ✅ Buscar usuários COM skip e limit corretos
    console.log('Buscando usuários...');
    const usersRes = await fetch('http://127.0.0.1:8000/api/v1/admin/users?skip=0&limit=100', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Status de usuários:', usersRes.status);
    
    let usersData = [];
    if (usersRes.ok) {
      usersData = await usersRes.json();
      console.log('Dados de usuários:', usersData);
    } else {
      console.error('Erro ao buscar usuários:', usersRes.status);
    }

    // ✅ Buscar produtos COM skip e limit corretos
    console.log('Buscando produtos...');
    const productsRes = await fetch('http://127.0.0.1:8000/api/v1/products?skip=0&limit=100', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Status de produtos:', productsRes.status);
    
    let productsData = [];
    if (productsRes.ok) {
      productsData = await productsRes.json();
      console.log('Dados de produtos:', productsData);
    } else {
      console.error('Erro ao buscar produtos:', productsRes.status);
    }

    // ✅ Buscar pedidos COM skip e limit corretos
    console.log('Buscando pedidos...');
    const ordersRes = await fetch('http://127.0.0.1:8000/api/v1/orders?skip=0&limit=100', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Status de pedidos:', ordersRes.status);
    
    let ordersData = [];
    if (ordersRes.ok) {
      ordersData = await ordersRes.json();
      console.log('Dados de pedidos:', ordersData);
    } else {
      console.error('Erro ao buscar pedidos:', ordersRes.status);
    }

    // ✅ Calcular receita total
    let totalRevenue = 0;
    if (Array.isArray(ordersData)) {
      totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
    }

    // ✅ Atualizar estado com os dados
    setStats({
      totalUsers: Array.isArray(usersData) ? usersData.length : 0,
      totalProducts: Array.isArray(productsData) ? productsData.length : 0,
      totalOrders: Array.isArray(ordersData) ? ordersData.length : 0,
      totalRevenue: totalRevenue,
    });

    console.log('Stats atualizados:', {
      totalUsers: Array.isArray(usersData) ? usersData.length : 0,
      totalProducts: Array.isArray(productsData) ? productsData.length : 0,
      totalOrders: Array.isArray(ordersData) ? ordersData.length : 0,
      totalRevenue: totalRevenue,
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    setStats({
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
    });
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Usuários"
            value={stats.totalUsers}
            icon="👥"
            color="border-blue-500"
          />
          <StatCard
            title="Total de Produtos"
            value={stats.totalProducts}
            icon="📦"
            color="border-green-500"
          />
          <StatCard
            title="Total de Pedidos"
            value={stats.totalOrders}
            icon="🛒"
            color="border-yellow-500"
          />
          <StatCard
            title="Receita Total"
            value={`R$ ${stats.totalRevenue.toFixed(2)}`}
            icon="💰"
            color="border-purple-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Voltar para Loja
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}