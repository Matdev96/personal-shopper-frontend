import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';
import requestService from '../services/requestService';
import { STATUS_LABEL, STATUS_COLOR, PAYMENT_METHOD_LABEL, formatDate } from '../utils/requestStatus';

const NEXT_STATUS = {
  pendente: { value: 'em_busca', label: 'Iniciar Busca' },
  em_busca: { value: 'encontrado', label: 'Marcar como Encontrado' },
  sinal_confirmado: { value: 'comprado', label: 'Marcar como Comprado' },
  comprado: { value: 'aguardando_pagamento_final', label: 'Solicitar Pagamento Final' },
};

export default function AdminRequestDetail() {
  const { requestId } = useParams();
  const [req, setReq] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [quoteForm, setQuoteForm] = useState({ quoted_price: '', found_image_url: '', admin_notes: '' });
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [cancelNotes, setCancelNotes] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);

  const load = async () => {
    try {
      const data = await requestService.adminGetById(requestId);
      setReq(data);
    } catch {
      toast.error('Solicitação não encontrada.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [requestId]);

  const handleNextStatus = async () => {
    const next = NEXT_STATUS[req.status];
    if (!next) return;
    if (!window.confirm(`Avançar para "${STATUS_LABEL[next.value]}"?`)) return;
    setActionLoading(true);
    try {
      const updated = await requestService.adminUpdateStatus(requestId, { status: next.value });
      setReq(updated);
      toast.success('Status atualizado!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erro ao atualizar status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuote = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const updated = await requestService.adminQuote(requestId, {
        quoted_price: Number(quoteForm.quoted_price),
        found_image_url: quoteForm.found_image_url || null,
        admin_notes: quoteForm.admin_notes || null,
      });
      setReq(updated);
      setShowQuoteForm(false);
      toast.success('Preço cotado enviado ao cliente!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erro ao cotar preço.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancelar esta solicitação?')) return;
    setActionLoading(true);
    try {
      const updated = await requestService.adminCancel(requestId, { status: 'cancelado', admin_notes: cancelNotes });
      setReq(updated);
      setShowCancelForm(false);
      toast.success('Solicitação cancelada.');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erro ao cancelar.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewPayment = async (paymentId, approve) => {
    const label = approve ? 'confirmar' : 'rejeitar';
    if (!window.confirm(`Deseja ${label} este pagamento?`)) return;
    setActionLoading(true);
    try {
      await requestService.adminReviewPayment(requestId, paymentId, {
        status: approve ? 'confirmado' : 'rejeitado',
      });
      toast.success(`Pagamento ${approve ? 'confirmado' : 'rejeitado'}!`);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erro ao revisar pagamento.');
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) return (
    <AdminLayout>
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    </AdminLayout>
  );

  if (!req) return <AdminLayout><p className="text-gray-500">Solicitação não encontrada.</p></AdminLayout>;

  const canAdvance = !!NEXT_STATUS[req.status];
  const canQuote = req.status === 'encontrado';
  const isFinished = ['entregue', 'cancelado', 'nao_encontrado'].includes(req.status);
  const pendingPayments = req.payments?.filter((p) => p.status === 'pendente') ?? [];

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/admin/requests" className="text-blue-600 hover:text-blue-700">Solicitações</Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-900 font-semibold">#{req.id} — {req.title}</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{req.title}</h1>
              <p className="text-gray-500 text-sm">
                Cliente: <strong>{req.user?.full_name ?? `#${req.user_id}`}</strong>
                {req.user?.email && <span className="ml-2 text-gray-400">({req.user.email})</span>}
              </p>
            </div>
            <span className={`shrink-0 text-sm font-semibold px-3 py-1.5 rounded-full ${STATUS_COLOR[req.status]}`}>
              {STATUS_LABEL[req.status] ?? req.status}
            </span>
          </div>
          <p className="text-xs text-gray-400">Criado em {formatDate(req.created_at)} • Atualizado em {formatDate(req.updated_at)}</p>
        </div>

        {/* Pagamentos pendentes — ação urgente */}
        {pendingPayments.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-yellow-800 mb-3">💳 Pagamento(s) aguardando revisão</h3>
            {pendingPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-white rounded-lg p-3 mb-2 border">
                <div>
                  <p className="font-semibold text-gray-900">
                    {p.type === 'sinal' ? 'Sinal (50%)' : 'Pagamento Final'} — R$ {Number(p.amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {PAYMENT_METHOD_LABEL[p.payment_method] ?? p.payment_method} • {formatDate(p.payment_date)}
                  </p>
                  {p.receipt_url && (
                    <a href={p.receipt_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">
                      Ver comprovante
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReviewPayment(p.id, true)}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => handleReviewPayment(p.id, false)}
                    disabled={actionLoading}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ações de status */}
        {!isFinished && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ações</h2>
            <div className="flex flex-wrap gap-3">
              {canAdvance && (
                <button
                  onClick={handleNextStatus}
                  disabled={actionLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {NEXT_STATUS[req.status].label}
                </button>
              )}
              {canQuote && !showQuoteForm && (
                <button
                  onClick={() => setShowQuoteForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cotar Preço
                </button>
              )}
              {!showCancelForm && (
                <button
                  onClick={() => setShowCancelForm(true)}
                  className="border border-red-300 text-red-600 hover:bg-red-50 px-5 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancelar Solicitação
                </button>
              )}
            </div>

            {/* Formulário de cotação */}
            {showQuoteForm && (
              <form onSubmit={handleQuote} className="mt-5 space-y-3 border-t pt-5">
                <h3 className="font-semibold text-gray-900">Informar Preço Cotado</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Preço (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={quoteForm.quoted_price}
                      onChange={(e) => setQuoteForm((p) => ({ ...p, quoted_price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="Ex: 250.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Foto encontrada (URL)</label>
                    <input
                      type="url"
                      value={quoteForm.found_image_url}
                      onChange={(e) => setQuoteForm((p) => ({ ...p, found_image_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="Link da foto do produto na loja"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Observações para o cliente</label>
                  <textarea
                    value={quoteForm.admin_notes}
                    onChange={(e) => setQuoteForm((p) => ({ ...p, admin_notes: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Ex: Produto disponível no tamanho M apenas..."
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={actionLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50">
                    Enviar Cotação
                  </button>
                  <button type="button" onClick={() => setShowQuoteForm(false)}
                    className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-50">
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {/* Formulário de cancelamento */}
            {showCancelForm && (
              <div className="mt-5 border-t pt-5 space-y-3">
                <h3 className="font-semibold text-red-700">Cancelar Solicitação</h3>
                <textarea
                  value={cancelNotes}
                  onChange={(e) => setCancelNotes(e.target.value)}
                  rows={2}
                  placeholder="Motivo do cancelamento (visível para o cliente)..."
                  className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <div className="flex gap-2">
                  <button onClick={handleCancel} disabled={actionLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50">
                    Confirmar Cancelamento
                  </button>
                  <button onClick={() => setShowCancelForm(false)}
                    className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-50">
                    Voltar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detalhes */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Detalhes do Pedido</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {req.description && (
              <div className="sm:col-span-2"><p className="text-gray-500">Descrição</p><p>{req.description}</p></div>
            )}
            {req.reference_image_url && (
              <div className="sm:col-span-2">
                <p className="text-gray-500 mb-1">Foto de referência</p>
                <a href={req.reference_image_url} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all text-xs">{req.reference_image_url}</a>
              </div>
            )}
            {req.preferred_store && <div><p className="text-gray-500">Loja preferida</p><p className="font-semibold">{req.preferred_store}</p></div>}
            <div><p className="text-gray-500">Quantidade</p><p className="font-semibold">{req.quantity}</p></div>
            {req.size && <div><p className="text-gray-500">Tamanho</p><p className="font-semibold">{req.size}</p></div>}
            {req.color && <div><p className="text-gray-500">Cor</p><p className="font-semibold">{req.color}</p></div>}
            {req.max_budget && <div><p className="text-gray-500">Orçamento máximo</p><p className="font-semibold">R$ {Number(req.max_budget).toFixed(2)}</p></div>}
            {req.quoted_price && (
              <>
                <div><p className="text-gray-500">Preço cotado</p><p className="font-bold text-blue-600">R$ {Number(req.quoted_price).toFixed(2)}</p></div>
                <div><p className="text-gray-500">Sinal (50%)</p><p className="font-semibold">R$ {Number(req.deposit_amount).toFixed(2)}</p></div>
                <div><p className="text-gray-500">Restante (50%)</p><p className="font-semibold">R$ {Number(req.remaining_amount).toFixed(2)}</p></div>
              </>
            )}
            {req.notes && <div className="sm:col-span-2"><p className="text-gray-500">Observações do cliente</p><p>{req.notes}</p></div>}
            {req.admin_notes && <div className="sm:col-span-2"><p className="text-gray-500">Notas internas</p><p className="text-indigo-700">{req.admin_notes}</p></div>}
          </div>
        </div>

        {/* Histórico de pagamentos */}
        {req.payments?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pagamentos</h2>
            <div className="space-y-3">
              {req.payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between border rounded-lg p-3 text-sm">
                  <div>
                    <p className="font-semibold">{p.type === 'sinal' ? 'Sinal (50%)' : 'Pagamento Final'}</p>
                    <p className="text-gray-500">{PAYMENT_METHOD_LABEL[p.payment_method] ?? p.payment_method} • {formatDate(p.payment_date)}</p>
                    {p.receipt_url && <a href={p.receipt_url} target="_blank" rel="noreferrer" className="text-blue-600 text-xs underline">Ver comprovante</a>}
                    {p.admin_notes && <p className="text-xs text-gray-400 mt-1">{p.admin_notes}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-bold">R$ {Number(p.amount).toFixed(2)}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      p.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                      p.status === 'rejeitado' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {p.status === 'confirmado' ? 'Confirmado' : p.status === 'rejeitado' ? 'Rejeitado' : 'Aguardando'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
