import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';
import requestService from '../services/requestService';
import { STATUS_LABEL, STATUS_COLOR, formatDate } from '../utils/requestStatus';

const FILTERS = [
  { value: null, label: 'Todas' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_busca', label: 'Em Busca' },
  { value: 'encontrado', label: 'Encontrado' },
  { value: 'aguardando_confirmacao', label: 'Aguard. Confirmação' },
  { value: 'aguardando_sinal', label: 'Aguard. Sinal' },
  { value: 'sinal_pago', label: 'Sinal Enviado' },
  { value: 'sinal_confirmado', label: 'Sinal Confirmado' },
  { value: 'comprado', label: 'Comprado' },
  { value: 'aguardando_pagamento_final', label: 'Aguard. Pgto Final' },
  { value: 'pago', label: 'Pgto Enviado' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
];

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(null);

  const load = async (filter) => {
    setIsLoading(true);
    try {
      const params = { limit: 50, ...(filter ? { status_filter: filter } : {}) };
      const data = await requestService.listAll(params);
      setRequests(data.items ?? []);
    } catch {
      toast.error('Erro ao carregar solicitações.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(statusFilter); }, [statusFilter]);

  const urgentStatuses = ['aguardando_confirmacao', 'sinal_pago', 'pago'];
  const urgent = requests.filter((r) => urgentStatuses.includes(r.status));

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Solicitações dos Clientes</h1>
          <span className="text-sm text-gray-500">{requests.length} resultado(s)</span>
        </div>

        {/* Alertas urgentes */}
        {urgent.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6">
            <p className="font-semibold text-yellow-800 mb-2">⚠️ Precisam de ação ({urgent.length})</p>
            <div className="space-y-1">
              {urgent.map((r) => (
                <Link
                  key={r.id}
                  to={`/admin/requests/${r.id}`}
                  className="flex items-center justify-between text-sm text-yellow-700 hover:text-yellow-900"
                >
                  <span>#{r.id} — {r.title} ({r.user?.full_name ?? 'Cliente'})</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[r.status]}`}>
                    {STATUS_LABEL[r.status]}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={String(f.value)}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
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
          <div className="bg-white rounded-xl p-12 text-center text-gray-500">
            Nenhuma solicitação encontrada.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">#</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Produto</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Cliente</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Cotado</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Data</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400">{r.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 truncate max-w-[200px]">{r.title}</p>
                      {r.preferred_store && <p className="text-xs text-gray-400">{r.preferred_store}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{r.user?.full_name ?? `#${r.user_id}`}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[r.status]}`}>
                        {STATUS_LABEL[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {r.quoted_price ? `R$ ${Number(r.quoted_price).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3">
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
    </AdminLayout>
  );
}
