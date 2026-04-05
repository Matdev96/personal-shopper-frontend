export const STATUS_LABEL = {
  pendente: 'Pendente',
  em_busca: 'Em Busca',
  encontrado: 'Encontrado',
  aguardando_confirmacao: 'Aguardando sua Confirmação',
  confirmado: 'Confirmado',
  aguardando_sinal: 'Aguardando Sinal (50%)',
  sinal_pago: 'Sinal Enviado',
  sinal_confirmado: 'Sinal Confirmado',
  comprado: 'Comprado',
  aguardando_pagamento_final: 'Aguardando Pagamento Final',
  pago: 'Pagamento Enviado',
  entregue: 'Entregue',
  nao_encontrado: 'Não Encontrado',
  cancelado: 'Cancelado',
};

export const STATUS_COLOR = {
  pendente: 'bg-gray-100 text-gray-700',
  em_busca: 'bg-blue-100 text-blue-700',
  encontrado: 'bg-indigo-100 text-indigo-700',
  aguardando_confirmacao: 'bg-yellow-100 text-yellow-800',
  confirmado: 'bg-teal-100 text-teal-700',
  aguardando_sinal: 'bg-orange-100 text-orange-700',
  sinal_pago: 'bg-orange-200 text-orange-800',
  sinal_confirmado: 'bg-cyan-100 text-cyan-700',
  comprado: 'bg-purple-100 text-purple-700',
  aguardando_pagamento_final: 'bg-pink-100 text-pink-700',
  pago: 'bg-pink-200 text-pink-800',
  entregue: 'bg-green-100 text-green-800',
  nao_encontrado: 'bg-red-100 text-red-700',
  cancelado: 'bg-red-200 text-red-800',
};

export const PAYMENT_METHOD_LABEL = {
  pix: 'PIX',
  transferencia: 'Transferência',
  dinheiro: 'Dinheiro',
  cartao: 'Cartão',
};

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
