/* global React, lucide */
const { useState, useEffect, useRef } = React;

function Icon({ name, size = 20, strokeWidth = 2, style, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const host = ref.current;
    if (!host || !window.lucide) return;
    host.innerHTML = '';
    const el = document.createElement('i');
    el.setAttribute('data-lucide', name);
    host.appendChild(el);
    window.lucide.createIcons({ attrs: { width: size, height: size, 'stroke-width': strokeWidth } });
  }, [name, size, strokeWidth]);
  return <span ref={ref} className={className} style={{ display: 'inline-flex', alignItems: 'center', ...style }} />;
}

function AdminButton({ variant = 'primary', size = 'md', children, onClick, style }) {
  const [h, setH] = useState(false);
  const v = {
    primary: { background: h ? 'var(--gold-strong)' : 'var(--gold)', color: '#fff' },
    secondary: { background: h ? '#262425' : 'var(--charcoal)', color: '#fff' },
    ghost: { background: '#fff', color: 'var(--ink-1)', border: '1px solid var(--line-strong)' },
    danger: { background: h ? '#8f322a' : 'var(--err-fg)', color: '#fff' },
  }[variant];
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: size === 'sm' ? 13 : 14,
        padding: size === 'sm' ? '7px 13px' : '9px 16px', borderRadius: 'var(--r-btn)', border: '1px solid transparent',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, transition: 'all var(--dur) var(--ease)', ...v, ...style }}>
      {children}
    </button>
  );
}

/* ---- Request status system (warm-tuned, from requestStatus.js) ---- */
const STATUS = {
  pendente: { label: 'Pendente', tone: 'pending' },
  em_busca: { label: 'Em Busca', tone: 'search' },
  encontrado: { label: 'Encontrado', tone: 'found' },
  aguardando_confirmacao: { label: 'Aguardando Confirmação', tone: 'pending' },
  confirmado: { label: 'Confirmado', tone: 'confirm' },
  aguardando_sinal: { label: 'Aguardando Sinal (50%)', tone: 'pay' },
  sinal_pago: { label: 'Sinal Enviado', tone: 'pay' },
  sinal_confirmado: { label: 'Sinal Confirmado', tone: 'confirm' },
  comprado: { label: 'Comprado', tone: 'bought' },
  aguardando_pagamento_final: { label: 'Aguardando Pagamento Final', tone: 'pay' },
  pago: { label: 'Pagamento Enviado', tone: 'pay' },
  entregue: { label: 'Entregue', tone: 'success' },
  nao_encontrado: { label: 'Não Encontrado', tone: 'danger' },
  cancelado: { label: 'Cancelado', tone: 'danger' },
  alternativa_disponivel: { label: 'Alternativa Disponível', tone: 'alt' },
};
const TONE = {
  pending: ['var(--status-pending-bg)', 'var(--status-pending-fg)'],
  search: ['var(--status-search-bg)', 'var(--status-search-fg)'],
  found: ['var(--status-found-bg)', 'var(--status-found-fg)'],
  confirm: ['var(--status-confirm-bg)', 'var(--status-confirm-fg)'],
  pay: ['var(--status-pay-bg)', 'var(--status-pay-fg)'],
  bought: ['var(--status-bought-bg)', 'var(--status-bought-fg)'],
  success: ['var(--status-success-bg)', 'var(--status-success-fg)'],
  danger: ['var(--status-danger-bg)', 'var(--status-danger-fg)'],
  alt: ['var(--status-alt-bg)', 'var(--status-alt-fg)'],
};
function StatusBadge({ status }) {
  const s = STATUS[status] || { label: status, tone: 'pending' };
  const [bg, fg] = TONE[s.tone];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--font-body)', fontWeight: 600,
      fontSize: 12, padding: '5px 11px', borderRadius: 'var(--r-badge)', lineHeight: 1, background: bg, color: fg, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

function StatCard({ title, value, icon, tone = 'gold' }) {
  const tones = {
    gold: ['var(--gold-tint)', 'var(--gold-deep)'],
    ok: ['var(--ok-bg)', 'var(--ok-fg)'],
    warn: ['var(--warn-bg)', 'var(--warn-fg)'],
    err: ['var(--err-bg)', 'var(--err-fg)'],
    neutral: ['var(--surface-2)', 'var(--ink-3)'],
  }[tone];
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', boxShadow: 'var(--shadow-sm)',
      padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--ink-3)' }}>{title}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--ink-1)', marginTop: 6, lineHeight: 1.05 }}>{value}</div>
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: tones[0], color: tones[1], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={21} />
      </div>
    </div>
  );
}

/* ---- Mock admin data ---- */
const REQUESTS = [
  { id: 142, client: 'Ana Beatriz', email: 'ana@email.com', title: 'Tênis Jordan 1 Retro High', store: 'Nike US', budget: 1200, size: '42', status: 'aguardando_confirmacao', date: '28/05/2026 14:32', quoted: 1180 },
  { id: 141, client: 'Carlos Mendes', email: 'carlos@email.com', title: 'iPhone 15 Pro 256GB', store: 'Apple US', budget: 6500, size: '—', status: 'em_busca', date: '28/05/2026 09:10', quoted: null },
  { id: 140, client: 'Júlia Santos', email: 'julia@email.com', title: 'Bolsa Louis Vuitton Neverfull', store: 'LV Paris', budget: 9000, size: 'MM', status: 'sinal_pago', date: '27/05/2026 18:45', quoted: 8700 },
  { id: 139, client: 'Pedro Rocha', email: 'pedro@email.com', title: 'Whey Protein Optimum 5lb', store: 'iHerb', budget: 350, size: '5lb', status: 'entregue', date: '26/05/2026 11:20', quoted: 320 },
  { id: 138, client: 'Marina Lopes', email: 'marina@email.com', title: 'Perfume Baccarat Rouge 540', store: 'Sephora US', budget: 2200, size: '70ml', status: 'pendente', date: '26/05/2026 08:02', quoted: null },
  { id: 137, client: 'Rafael Dias', email: 'rafael@email.com', title: 'Notebook Dell XPS 13', store: 'Dell US', budget: 8000, size: '—', status: 'nao_encontrado', date: '25/05/2026 16:50', quoted: null },
];
const ADMIN_PRODUCTS = [
  { id: 1, name: 'Tênis Nike Air Max 90', cat: 'Tênis & Calçados', price: 899.9, stock: 8, active: true, icon: 'footprints' },
  { id: 2, name: 'Moletom Champion Reverse', cat: 'Roupas', price: 459.0, stock: 14, active: true, icon: 'shirt' },
  { id: 3, name: 'Óculos Ray-Ban Wayfarer', cat: 'Acessórios', price: 729.9, stock: 5, active: true, icon: 'glasses' },
  { id: 4, name: 'Perfume Tom Ford Noir', cat: 'Beleza', price: 1290.0, stock: 0, active: false, icon: 'sparkles' },
  { id: 5, name: 'Apple AirPods Pro 2', cat: 'Eletrônicos', price: 1899.0, stock: 11, active: true, icon: 'headphones' },
  { id: 6, name: 'Bolsa Coach Willow', cat: 'Acessórios', price: 2150.0, stock: 3, active: true, icon: 'shopping-bag' },
];
const USERS = [
  { id: 1, name: 'Ana Beatriz', email: 'ana@email.com', admin: false, orders: 7 },
  { id: 2, name: 'Carlos Mendes', email: 'carlos@email.com', admin: false, orders: 3 },
  { id: 3, name: 'Admin', email: 'admin@personalshopper.com', admin: true, orders: 0 },
];
const BRL = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');

/* Lifecycle order for the timeline */
const LIFECYCLE = ['pendente', 'em_busca', 'encontrado', 'aguardando_confirmacao', 'confirmado', 'aguardando_sinal', 'sinal_pago', 'comprado', 'aguardando_pagamento_final', 'pago', 'entregue'];

Object.assign(window, { Icon, AdminButton, STATUS, TONE, StatusBadge, StatCard, REQUESTS, ADMIN_PRODUCTS, USERS, BRL, LIFECYCLE });
