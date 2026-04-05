import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import requestService from '../services/requestService';

export default function RequestNew() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    reference_image_url: '',
    preferred_store: '',
    size: '',
    color: '',
    max_budget: '',
    quantity: 1,
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Informe o nome do produto que você está buscando.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...form,
        quantity: Number(form.quantity) || 1,
        max_budget: form.max_budget ? Number(form.max_budget) : null,
        reference_image_url: form.reference_image_url || null,
        preferred_store: form.preferred_store || null,
        size: form.size || null,
        color: form.color || null,
        notes: form.notes || null,
      };
      const created = await requestService.create(payload);
      toast.success('Solicitação enviada! A Claudia vai buscar seu produto.');
      navigate(`/requests/${created.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erro ao criar solicitação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link to="/requests" className="text-blue-600 hover:text-blue-700">
            Minhas Solicitações
          </Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-900 font-semibold">Nova Solicitação</span>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Solicitar Produto</h1>
          <p className="text-gray-500 mb-8">
            Descreva o produto que você quer trazer de Orlando. Quanto mais detalhes,
            mais fácil para a Claudia encontrar!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                O que você quer? *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ex: Perfume Victoria's Secret Bombshell, Tênis Nike Air Max..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Descrição <span className="font-normal text-gray-400">(opcional)</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Descreva detalhes do produto, modelo específico, variação..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Foto de referência */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Link da foto de referência <span className="font-normal text-gray-400">(opcional)</span>
              </label>
              <input
                type="url"
                name="reference_image_url"
                value={form.reference_image_url}
                onChange={handleChange}
                placeholder="Cole o link de uma foto do produto (Instagram, site, Pinterest...)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Loja preferida */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Loja preferida <span className="font-normal text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  name="preferred_store"
                  value={form.preferred_store}
                  onChange={handleChange}
                  placeholder="Ex: Victoria's Secret, Nike, Primark..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Quantidade */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  min={1}
                  max={50}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tamanho */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Tamanho <span className="font-normal text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  placeholder="Ex: M, G, 38, P/M..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cor */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Cor <span className="font-normal text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  placeholder="Ex: Azul, Rose Gold, Preto..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Orçamento máximo */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Orçamento máximo (R$) <span className="font-normal text-gray-400">(opcional)</span>
                </label>
                <input
                  type="number"
                  name="max_budget"
                  value={form.max_budget}
                  onChange={handleChange}
                  min={1}
                  step="0.01"
                  placeholder="Ex: 300.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Observações <span className="font-normal text-gray-400">(opcional)</span>
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Qualquer informação extra que ajude a Claudia..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {isLoading ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
