import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';
import useAuthStore from '../store/authStore';

export default function AdminUsers() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/');
      return;
    }

    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (userId, isCurrentlyActive) => {
    const acao = isCurrentlyActive ? 'desativar' : 'ativar';
    if (!window.confirm(`Tem certeza que deseja ${acao} este usuário?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}/toggle-active`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error();

      toast.success(`Usuário ${isCurrentlyActive ? 'desativado' : 'ativado'} com sucesso`);
      fetchUsers();
    } catch {
      toast.error('Erro ao alterar status do usuário');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar usuário');
      }

      toast.success('Usuário deletado com sucesso');
      fetchUsers();
    } catch (error) {
      toast.error('Erro ao deletar usuário');
      console.error(error);
    }
  };

  const handleViewOrders = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar pedidos');
      }

      const orders = await response.json();
      setSelectedUser({ ...users.find(u => u.id === userId), orders });
    } catch (error) {
      toast.error('Erro ao carregar pedidos do usuário');
      console.error(error);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gerenciamento de Usuários</h1>

        {selectedUser ? (
          // Detalhes do usuário
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              onClick={() => setSelectedUser(null)}
              className="mb-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Voltar
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedUser.full_name}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-lg font-semibold text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Username</p>
                <p className="text-lg font-semibold text-gray-900">{selectedUser.username}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedUser.is_active ? '✅ Ativo' : '❌ Inativo'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Cadastrado em</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(selectedUser.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Pedidos do usuário */}
            <h3 className="text-xl font-bold text-gray-900 mb-4">Pedidos ({selectedUser.orders?.length || 0})</h3>
            {selectedUser.orders && selectedUser.orders.length > 0 ? (
              <div className="space-y-4">
                {selectedUser.orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">Pedido #{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">R$ {order.total_price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{order.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Este usuário não tem pedidos</p>
            )}
          </div>
        ) : (
          // Lista de usuários
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cadastrado em</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{u.full_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {u.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(u.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleViewOrders(u.id)}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Ver Pedidos
                      </button>
                      <button
                        onClick={() => handleToggleActive(u.id, u.is_active)}
                        className={`font-semibold ${u.is_active ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}`}
                      >
                        {u.is_active ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-red-600 hover:text-red-700 font-semibold"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}