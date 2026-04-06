import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import requestService from '../services/requestService';
import paymentService from '../services/paymentService';
import { STATUS_LABEL, STATUS_COLOR, PAYMENT_METHOD_LABEL, formatDate } from '../utils/requestStatus';

export default function RequestDetail() {
  const { requestId } = useParams();
  const [req, setReq] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    type: '',
    amount: '',
    payment_method: 'pix',
    payment_date: new Date().toISOString().slice(0, 16),
    receipt_url: '',
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const load = async () => {
    try {
      const data = await requestService.getById(requestId);
      setReq(data);
      if (data.status === 'aguardando_sinal') {
        setPaymentForm((p) => ({ ...p, type: 'sinal', amount: data.deposit_amount }));
        setShowPaymentForm(true);
      } else if (data.status === 'aguardando_pagamento_final') {
        setPaymentForm((p) => ({ ...p, type: 'final', amount: data.remaining_amount }));
        setShowPaymentForm(true);
      }
    } catch {
      toast.error('Solicitação não encontrada.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [requestId]);

  const handleConfirm = async () => {
    if (!window.confirm('Confirmar o preço cotado pela Claudia?')) return;
    setActionLoading(true);
    try {
      const updated = await requestService.confirm(requestId);
      setReq(updated);
      toast.success('Preço confirmado! Agora envie o sinal para garantir sua compra.');
      setPaymentForm((p) => ({ ...p, type: 'sinal', amount: updated.deposit_amount }));
      setShowPaymentForm(true);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erro ao confirmar.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar esta solicitação?')) return;
    setActionLoading(true);
    try {
      const updated = await requestService.cancel(requestId);
      setReq(updated);
      toast.success('Solicitação cancelada.');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Cancelamento não permitido neste status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await paymentService.register({
        request_id: Number(requestId),
        type: paymentForm.type,
        amount: Number(paymentForm.amount),
        payment_method: paymentForm.payment_method,
        payment_date: new Date(paymentForm.payment_date).toISOString(),
        receipt_url: paymentForm.receipt_url || null,
      });
      toast.success('Pagamento registrado! Aguarde a confirmação da Claudia.');
      setShowPaymentForm(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erro ao registrar pagamento.');
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );

  if (!req) return null;

  const isCancellable = ['pendente', 'em_busca'].includes(req.status);
  const needsConfirmation = req.status === 'aguardando_confirmacao';
  const needsPayment = ['aguardando_sinal', 'aguardando_pagamento_final'].includes(req.status);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/requests" className="text-blue-600 hover:text-blue-700">Minhas Solicitações</Link>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-900 font-semibold truncate">{req.title}</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{req.title}</h1>
            <span className={`shrink-0 text-sm font-semibold px-3 py-1.5 rounded-full ${STATUS_COLOR[req.status]}`}>
              {STATUS_LABEL[req.status] ?? req.status}
            </span>
          </div>
          <p className="text-sm text-gray-400">Criado em {formatDate(req.created_at)}</p>
        </div>

        {/* Alerta de cancelamento */}
        {req.status === 'cancelado' && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-red-800 mb-1">Solicitação Cancelada</h3>
            {req.admin_notes ? (
              <p className="text-red-700 text-sm">
                <strong>Motivo:</strong> {req.admin_notes}
              </p>
            ) : (
              <p className="text-red-700 text-sm">Nenhum motivo informado. Entre em contato com a Claudia para mais detalhes.</p>
            )}
          </div>
        )}

        {/* Alerta de ação necessária */}
        {needsConfirmation && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-yellow-800 mb-1">A Claudia encontrou seu produto!</h3>
            <p className="text-yellow-700 text-sm mb-4">
              Preço cotado: <strong>R$ {Number(req.quoted_price).toFixed(2)}</strong>
              {req.found_image_url && (
                <a href={req.found_image_url} target="_blank" rel="noreferrer" className="ml-3 text-blue-600 underline">
                  Ver foto do produto
                </a>
              )}
            </p>
            <p className="text-yellow-700 text-sm mb-4">
              Ao confirmar, você será solicitado a pagar o sinal de{' '}
              <strong>R$ {Number(req.deposit_amount).toFixed(2)}</strong> (50%).
            </p>
            <button
              onClick={handleConfirm}
              disabled={actionLoading}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              Confirmar e Pagar Sinal
            </button>
          </div>
        )}

        {/* Formulário de pagamento */}
        {needsPayment && showPaymentForm && (
          <div className="bg-orange-50 border border-orange-300 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-orange-800 mb-1">
              {paymentForm.type === 'sinal' ? 'Enviar Sinal (50%)' : 'Enviar Pagamento Final'}
            </h3>
            <p className="text-orange-700 text-sm mb-4">
              Valor: <strong>R$ {Number(paymentForm.amount).toFixed(2)}</strong>.
              Faça o pagamento e registre abaixo com o comprovante.
            </p>
            <form onSubmit={handlePayment} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Forma de pagamento</label>
                  <select
                    value={paymentForm.payment_method}
                    onChange={(e) => setPaymentForm((p) => ({ ...p, payment_method: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="pix">PIX</option>
                    <option value="transferencia">Transferência</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartao">Cartão</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Data do pagamento</label>
                  <input
                    type="datetime-local"
                    value={paymentForm.payment_date}
                    onChange={(e) => setPaymentForm((p) => ({ ...p, payment_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Link do comprovante <span className="font-normal text-gray-400">(opcional)</span>
                </label>
                <input
                  type="url"
                  value={paymentForm.receipt_url}
                  onChange={(e) => setPaymentForm((p) => ({ ...p, receipt_url: e.target.value }))}
                  placeholder="Cole o link do print do comprovante (Drive, etc.)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Registrando...' : 'Registrar Pagamento'}
              </button>
            </form>
          </div>
        )}

        {/* Detalhes do produto */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Detalhes da Solicitação</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {req.description && (
              <div className="sm:col-span-2">
                <p className="text-gray-500 mb-1">Descrição</p>
                <p className="text-gray-900">{req.description}</p>
              </div>
            )}
            {req.reference_image_url && (
              <div className="sm:col-span-2">
                <p className="text-gray-500 mb-1">Foto de referência</p>
                <a href={req.reference_image_url} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all">
                  {req.reference_image_url}
                </a>
              </div>
            )}
            {req.preferred_store && (
              <div><p className="text-gray-500">Loja preferida</p><p className="font-semibold">{req.preferred_store}</p></div>
            )}
            <div><p className="text-gray-500">Quantidade</p><p className="font-semibold">{req.quantity}</p></div>
            {req.size && <div><p className="text-gray-500">Tamanho</p><p className="font-semibold">{req.size}</p></div>}
            {req.color && <div><p className="text-gray-500">Cor</p><p className="font-semibold">{req.color}</p></div>}
            {req.max_budget && (
              <div><p className="text-gray-500">Orçamento máximo</p><p className="font-semibold">R$ {Number(req.max_budget).toFixed(2)}</p></div>
            )}
            {req.quoted_price && (
              <div><p className="text-gray-500">Preço cotado</p><p className="font-bold text-blue-600 text-base">R$ {Number(req.quoted_price).toFixed(2)}</p></div>
            )}
            {req.notes && (
              <div className="sm:col-span-2"><p className="text-gray-500">Observações</p><p className="text-gray-900">{req.notes}</p></div>
            )}
            {req.admin_notes && req.status === 'cancelado' && (
              <div className="sm:col-span-2">
                <p className="text-gray-500">Motivo do cancelamento</p>
                <p className="text-red-700 font-semibold">{req.admin_notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagamentos */}
        {req.payments?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pagamentos</h2>
            <div className="space-y-3">
              {req.payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">
                      {p.type === 'sinal' ? 'Sinal (50%)' : 'Pagamento Final'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {PAYMENT_METHOD_LABEL[p.payment_method] ?? p.payment_method} • {formatDate(p.payment_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">R$ {Number(p.amount).toFixed(2)}</p>
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

        {/* Ações */}
        {isCancellable && (
          <button
            onClick={handleCancel}
            disabled={actionLoading}
            className="w-full border border-red-300 text-red-600 hover:bg-red-50 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            Cancelar Solicitação
          </button>
        )}
      </div>
    </div>
  );
}
