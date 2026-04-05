import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import requestService from '../services/requestService';
import { STATUS_LABEL, STATUS_COLOR, formatDate } from '../utils/requestStatus';

const FILTERS = [
  { value: null, label: 'Todas' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_busca', label: 'Em Busca' },
  { value: 'aguardando_confirmacao', label: 'Aguard. Confirmação' },
  { value: 'aguardando_sinal', label: 'Aguard. Sinal' },
  { value: 'comprado', label: 'Comprado' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
];

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(null);

  const load = async (filter) => {
    setIsLoading(true);
    try {
      const params = filter ? { status_filter: filter } : {};
      const data = await requestService.listMine(params);
      setRequests(data.items ?? []);
    } catch {
      toast.error('Erro ao carregar solicitações.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(statusFilter); }, [statusFilter]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="mb-2">
              <Link to="/" className="text-blue-600 hover:text-blue-700">Home</Link>
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-900 font-semibold">Minhas Solicitações</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Solicitações</h1>
          </div>
          <Link
            to="/requests/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
          >
            + Nova Solicitação
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={String(f.value)}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                statusFilter === f.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-5xl mb-4">🛍️</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma solicitação</h2>
            <p className="text-gray-500 mb-6">
              Quer trazer algo de Orlando? Crie sua primeira solicitação!
            </p>
            <Link
              to="/requests/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Nova Solicitação
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <Link
                key={req.id}
                to={`/requests/${req.id}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{req.title}</h3>
                      <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[req.status]}`}>
                        {STATUS_LABEL[req.status] ?? req.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{req.description || '—'}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                      {req.preferred_store && <span>🏪 {req.preferred_store}</span>}
                      {req.size && <span>📐 {req.size}</span>}
                      {req.color && <span>🎨 {req.color}</span>}
                      {req.max_budget && <span>💰 até R$ {Number(req.max_budget).toFixed(2)}</span>}
                      {req.quoted_price && (
                        <span className="font-semibold text-blue-600">
                          Cotado: R$ {Number(req.quoted_price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">{formatDate(req.created_at)}</p>
                    <p className="text-xs text-gray-400 mt-1">Qtd: {req.quantity}</p>
                  </div>
                </div>

                {/* Barra de progresso do status */}
                {req.status === 'aguardando_confirmacao' && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                    ⚠️ A Claudia encontrou seu produto! Acesse para ver o preço e confirmar.
                  </div>
                )}
                {req.status === 'aguardando_sinal' && (
                  <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
                    💳 Envie o sinal de R$ {Number(req.deposit_amount).toFixed(2)} para confirmar a compra.
                  </div>
                )}
                {req.status === 'aguardando_pagamento_final' && (
                  <div className="mt-4 bg-pink-50 border border-pink-200 rounded-lg p-3 text-sm text-pink-800">
                    💳 Produto chegou! Envie o pagamento final de R$ {Number(req.remaining_amount).toFixed(2)}.
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
