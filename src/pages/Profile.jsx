import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore';

export default function Profile() {
  const { user, updateUser, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    const payload = {};
    if (formData.full_name !== user?.full_name) payload.full_name = formData.full_name;
    if (formData.email !== user?.email) payload.email = formData.email;
    if (formData.password) payload.password = formData.password;

    if (Object.keys(payload).length === 0) {
      toast.info('Nenhuma alteração detectada');
      return;
    }

    try {
      await updateUser(payload);
      toast.success('Perfil atualizado com sucesso!');
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      toast.error(error?.detail || 'Erro ao atualizar perfil');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-700">Home</Link>
          <span className="text-gray-600 mx-2">/</span>
          <span className="text-gray-900 font-semibold">Meu Perfil</span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
          <p className="text-gray-600 mb-8">Atualize seus dados pessoais abaixo.</p>

          {/* Info atual */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800">
              <strong>Usuário:</strong> {user?.username} &nbsp;|&nbsp;
              <strong>Conta:</strong> {user?.is_admin ? 'Administrador' : 'Cliente'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome completo */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Seu nome completo"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="seu@email.com"
              />
            </div>

            <hr className="border-gray-200" />

            <p className="text-sm text-gray-600">
              Deixe os campos de senha em branco para não alterá-la.
            </p>

            {/* Nova senha */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nova Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Nova senha (opcional)"
              />
            </div>

            {/* Confirmar senha */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Confirme a nova senha"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
