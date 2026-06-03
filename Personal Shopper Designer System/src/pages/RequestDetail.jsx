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

  const handleAcceptAlternative = async () => {
    if (!window.confirm('Aceitar a alternativa sugerida pela Claudia e prosseguir com a compra?')) return;
    setActionLoading(true);
    try {
      const updated = await requestService.acceptAlternative(requestId);
      setReq(updated);
      toast.success('Alternativa aceita! Confirme o preço para prosseguir.');
      setPaymentForm((p) => ({ ...p, type: 'sinal', amount: updated.deposit_amount }));
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erro ao aceitar alternativa.');
    } finally {
      setActionLoading(false);
    }
  };

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

  const isCancellable = ['pendente', 'em_busca', 'alternativa_disponivel'].includes(req.status);
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

        {/* Alternativa disponível */}
        {req.status === 'alternativa_disponivel' && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-amber-800 mb-2">A Claudia encontrou uma alternativa!</h3>
            <p className="text-amber-700 text-sm mb-3">{req.admin_notes}</p>
            {req.found_image_url && (
              <a href={req.found_image_url} target="_blank" rel="noreferrer"
                className="inline-block text-blue-600 underline text-sm mb-3">
                Ver foto da alternativa
              </a>
            )}
            <p className="text-amber-700 text-sm mb-4">
              Preço: <strong>R$ {Number(req.quoted_price).toFixed(2)}</strong>
              {' '}— Sinal: <strong>R$ {Number(req.deposit_amount).toFixed(2)}</strong>
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAcceptAlternative}
                disabled={actionLoading}
                className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                Aceitar e Prosseguir
              </button>
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="border border-red-300 text-red-600 hover:bg-red-50 px-5 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                Recusar e Cancelar
              </button>
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Olá Claudia! Tenho dúvidas sobre a alternativa encontrada para minha solicitação: ${req.title}`)}`}
                target="_blank"
                rel="noreferrer"
                className="border border-green-500 text-green-700 hover:bg-green-50 px-5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.533 5.849L.057 23.012a1 1 0 001.217 1.217l6.19-1.49A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.848 0-3.578-.497-5.07-1.367l-.361-.214-3.736.899.916-3.645-.235-.374A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Conversar no WhatsApp
              </a>
            </div>
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
