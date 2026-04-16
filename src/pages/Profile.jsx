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

  const [addressData, setAddressData] = useState({
    retirar_na_loja: user?.retirar_na_loja ?? false,
    cep: user?.cep || '',
    logradouro: user?.logradouro || '',
    numero: user?.numero || '',
    complemento: user?.complemento || '',
    bairro: user?.bairro || '',
    cidade: user?.cidade || '',
    estado: user?.estado || '',
  });

  const [cepLoading, setCepLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressData({ ...addressData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleCepBlur = async () => {
    const cep = addressData.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }

      setAddressData((prev) => ({
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

    // Incluir campos de endereço sempre que a seção de endereço for salva
    payload.retirar_na_loja = addressData.retirar_na_loja;
    if (!addressData.retirar_na_loja) {
      payload.cep = addressData.cep;
      payload.logradouro = addressData.logradouro;
      payload.numero = addressData.numero;
      payload.complemento = addressData.complemento;
      payload.bairro = addressData.bairro;
      payload.cidade = addressData.cidade;
      payload.estado = addressData.estado;
    }

    try {
      await updateUser(payload);
      toast.success('Perfil atualizado com sucesso!');
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      toast.error(error?.detail || 'Erro ao atualizar perfil');
    }
  };

  const hasAddress = user?.cep || user?.logradouro;

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

            <hr className="border-gray-200" />

            {/* Seção de Endereço */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Endereço de Entrega</h2>
              <p className="text-sm text-gray-500 mb-4">
                Salve seu endereço para agilizar os próximos pedidos.
              </p>

              {/* Toggle: Retirar na Loja / Endereço */}
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setAddressData((prev) => ({ ...prev, retirar_na_loja: true }))}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-colors ${
                    addressData.retirar_na_loja
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Retirar na Loja
                </button>
                <button
                  type="button"
                  onClick={() => setAddressData((prev) => ({ ...prev, retirar_na_loja: false }))}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-colors ${
                    !addressData.retirar_na_loja
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Entregar no Endereço
                </button>
              </div>

              {/* Formulário de endereço — só aparece quando não é retirada */}
              {!addressData.retirar_na_loja && (
                <div className="space-y-4">
                  {/* CEP */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      CEP
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="cep"
                        value={addressData.cep}
                        onChange={handleAddressChange}
                        onBlur={handleCepBlur}
                        maxLength={9}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="00000-000"
                      />
                      {cepLoading && (
                        <span className="self-center text-sm text-blue-600 whitespace-nowrap">
                          Buscando...
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Digite o CEP para preencher o endereço automaticamente.
                    </p>
                  </div>

                  {/* Logradouro */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Rua / Avenida
                    </label>
                    <input
                      type="text"
                      name="logradouro"
                      value={addressData.logradouro}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Rua das Flores"
                    />
                  </div>

                  {/* Número e Complemento */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Número
                      </label>
                      <input
                        type="text"
                        name="numero"
                        value={addressData.numero}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Complemento <span className="text-gray-400 font-normal">(opcional)</span>
                      </label>
                      <input
                        type="text"
                        name="complemento"
                        value={addressData.complemento}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Apto 12"
                      />
                    </div>
                  </div>

                  {/* Bairro */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Bairro
                    </label>
                    <input
                      type="text"
                      name="bairro"
                      value={addressData.bairro}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Centro"
                    />
                  </div>

                  {/* Cidade e Estado */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        name="cidade"
                        value={addressData.cidade}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="São Paulo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Estado (UF)
                      </label>
                      <input
                        type="text"
                        name="estado"
                        value={addressData.estado}
                        onChange={handleAddressChange}
                        maxLength={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="SP"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Endereço salvo atual */}
              {hasAddress && !addressData.retirar_na_loja && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-700 font-semibold mb-1">Endereço salvo atualmente:</p>
                  <p className="text-sm text-green-800">
                    {user.logradouro}, {user.numero}
                    {user.complemento ? ` - ${user.complemento}` : ''} — {user.bairro}, {user.cidade}/{user.estado} — CEP {user.cep}
                  </p>
                </div>
              )}
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
