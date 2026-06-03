import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Package, ShoppingCart, Wallet, Search, Clock, AlertTriangle, ArrowRight, ChevronRight } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import useAuthStore from '../store/authStore';
import requestService from '../services/requestService';
import { STATUS_LABEL, STATUS_COLOR, formatDate } from '../utils/requestStatus';

const URGENT_STATUSES = ['aguardando_confirmacao', 'sinal_pago', 'pago'];

const STATUS_STYLE = {
  pendente: { bg: 'var(--status-pending-bg)', fg: 'var(--status-pending-fg)' },
  em_busca: { bg: 'var(--status-search-bg)', fg: 'var(--status-search-fg)' },
  encontrado: { bg: 'var(--status-found-bg)', fg: 'var(--status-found-fg)' },
  aguardando_confirmacao: { bg: 'var(--status-pending-bg)', fg: 'var(--status-pending-fg)' },
  confirmado: { bg: 'var(--status-confirm-bg)', fg: 'var(--status-confirm-fg)' },
  aguardando_sinal: { bg: 'var(--status-pay-bg)', fg: 'var(--status-pay-fg)' },
  sinal_pago: { bg: 'var(--status-pay-bg)', fg: 'var(--status-pay-fg)' },
  sinal_confirmado: { bg: 'var(--status-confirm-bg)', fg: 'var(--status-confirm-fg)' },
  comprado: { bg: 'var(--status-bought-bg)', fg: 'var(--status-bought-fg)' },
  aguardando_pagamento_final: { bg: 'var(--status-pay-bg)', fg: 'var(--status-pay-fg)' },
  pago: { bg: 'var(--status-pay-bg)', fg: 'var(--status-pay-fg)' },
  entregue: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-fg)' },
  nao_encontrado: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-fg)' },
  cancelado: { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-fg)' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { bg: 'var(--surface-2)', fg: 'var(--ink-3)' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, padding: '4px 10px', borderRadius: 999, background: s.bg, color: s.fg, whiteSpace: 'nowrap' }}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function StatCard({ title, value, Icon, tone = 'gold' }) {
  const tones = {
    gold:    ['var(--gold-tint)',    'var(--gold-deep)'],
    ok:      ['var(--ok-bg)',        'var(--ok-fg)'],
    warn:    ['var(--warn-bg)',      'var(--warn-fg)'],
    err:     ['var(--err-bg)',       'var(--err-fg)'],
    neutral: ['var(--surface-2)',    'var(--ink-3)'],
  }[tone];
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', boxShadow: 'var(--shadow-sm)', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', marginBottom: 6 }}>{title}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--ink-1)', lineHeight: 1.05 }}>{value}</div>
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: tones[0], color: tones[1], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={21} />
      </div>
    </div>
  );
}

const TH = { textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--ink-3)', padding: '0 16px 12px' };
const TD = { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-2)', padding: '14px 16px', borderTop: '1px solid var(--line)' };
const PANEL = { background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', boxShadow: 'var(--shadow-sm)' };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0, totalRequests: 0, pendingRequests: 0, urgentRequests: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.is_admin) { navigate('/'); return; }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const [usersRes, productsRes, ordersRes, allRequestsRes, pendingRequestsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users?skip=0&limit=100`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${import.meta.env.VITE_API_URL}/api/v1/products?skip=0&limit=100`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/orders/all?limit=200`, { headers: { Authorization: `Bearer ${token}` } }),
        requestService.listAll({ limit: 5 }),
        requestService.listAll({ status_filter: 'pendente', limit: 100 }),
      ]);
      const usersData = usersRes.ok ? await usersRes.json() : [];
      const productsJson = productsRes.ok ? await productsRes.json() : {};
      const productsData = productsJson.items ?? productsJson ?? [];
      const ordersJson = ordersRes.ok ? await ordersRes.json() : { items: [], total: 0 };
      const ordersData = ordersJson.items ?? [];
      const recent = allRequestsRes.items ?? [];
      const pending = pendingRequestsRes.items ?? [];
      const urgentCount = recent.filter((r) => URGENT_STATUSES.includes(r.status)).length;
      const totalRevenue = Array.isArray(ordersData) ? ordersData.reduce((s, o) => s + (o.total_price || 0), 0) : 0;
      setStats({
        totalUsers: Array.isArray(usersData) ? usersData.length : 0,
        totalProducts: Array.isArray(productsData) ? productsData.length : 0,
        totalOrders: ordersJson.total ?? ordersData.length,
        totalRevenue, totalRequests: allRequestsRes.total ?? recent.length,
        pendingRequests: pendingRequestsRes.total ?? pending.length, urgentRequests: urgentCount,
      });
      setRecentRequests(recent);
    } catch { } finally { setIsLoading(false); }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div className="ps-spin" style={{ width: 40, height: 40, borderRadius: 999, border: '3px solid var(--gold-tint)', borderTopColor: 'var(--gold)' }} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: 32, background: 'var(--surface-2)', minHeight: '100%' }}>
        {/* E-commerce stats */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-4)', margin: '0 0 12px' }}>E-commerce</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 16, marginBottom: 22 }}>
          <StatCard title="Total de Usuários" value={stats.totalUsers} Icon={Users} tone="gold" />
          <StatCard title="Total de Produtos" value={stats.totalProducts} Icon={Package} tone="ok" />
          <StatCard title="Total de Pedidos" value={stats.totalOrders} Icon={ShoppingCart} tone="warn" />
          <StatCard title="Receita Total" value={`R$ ${stats.totalRevenue.toFixed(2).replace('.', ',')}`} Icon={Wallet} tone="gold" />
        </div>

        {/* Requests stats */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-4)', margin: '0 0 12px' }}>Solicitações de Busca</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 16, marginBottom: 28 }}>
          <StatCard title="Total de Solicitações" value={stats.totalRequests} Icon={Search} tone="gold" />
          <StatCard title="Solicitações Pendentes" value={stats.pendingRequests} Icon={Clock} tone="warn" />
          <StatCard title="Precisam de Ação" value={stats.urgentRequests} Icon={AlertTriangle} tone={stats.urgentRequests > 0 ? 'err' : 'neutral'} />
        </div>

        {/* Quick actions */}
        <div style={{ ...PANEL, padding: 22, marginBottom: 22 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--ink-1)', margin: '0 0 16px' }}>Ações Rápidas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 }}>
            {[
              { label: 'Gerenciar Usuários', path: '/admin/users', variant: 'secondary' },
              { label: 'Gerenciar Produtos', path: '/admin/products', variant: 'secondary' },
              { label: `Ver Solicitações${stats.pendingRequests > 0 ? ` (${stats.pendingRequests})` : ''}`, path: '/admin/requests', variant: 'primary' },
              { label: 'Voltar para Loja', path: '/', variant: 'ghost' },
            ].map(({ label, path, variant }) => (
              <Link key={path} to={path}
                style={{
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, textDecoration: 'none', textAlign: 'center',
                  padding: '10px 14px', borderRadius: 'var(--r-btn)', border: '1px solid transparent',
                  background: variant === 'primary' ? 'var(--gold)' : variant === 'secondary' ? 'var(--charcoal)' : '#fff',
                  color: variant === 'ghost' ? 'var(--ink-1)' : '#fff',
                  borderColor: variant === 'ghost' ? 'var(--line-strong)' : 'transparent',
                  transition: 'all var(--dur) var(--ease)',
                }}
                onMouseEnter={(e) => { if (variant === 'primary') e.currentTarget.style.background = 'var(--gold-strong)'; else if (variant === 'secondary') e.currentTarget.style.background = '#262425'; else e.currentTarget.style.borderColor = 'var(--ink-3)'; }}
                onMouseLeave={(e) => { if (variant === 'primary') e.currentTarget.style.background = 'var(--gold)'; else if (variant === 'secondary') e.currentTarget.style.background = 'var(--charcoal)'; else e.currentTarget.style.borderColor = 'var(--line-strong)'; }}
              >{label}</Link>
            ))}
          </div>
        </div>

        {/* Recent requests */}
        <div style={{ ...PANEL, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--ink-1)', margin: 0 }}>Solicitações Recentes</h2>
            <Link to="/admin/requests" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--gold-deep)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-3)', textAlign: 'center', padding: '24px 0', margin: 0 }}>Nenhuma solicitação encontrada.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 640, borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={TH}>#</th>
                    <th style={TH}>Cliente</th>
                    <th style={TH}>Produto</th>
                    <th style={TH}>Status</th>
                    <th style={TH}>Data</th>
                    <th style={TH}></th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((r) => (
                    <tr key={r.id} style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/admin/requests/${r.id}`)}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ ...TD, color: 'var(--ink-4)' }}>{r.id}</td>
                      <td style={TD}>
                        <div style={{ fontWeight: 600, color: 'var(--ink-1)' }}>{r.user?.full_name ?? `#${r.user_id}`}</div>
                        {r.user?.email && <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>{r.user.email}</div>}
                      </td>
                      <td style={{ ...TD, maxWidth: 200 }}>
                        <div style={{ color: 'var(--ink-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                        {r.preferred_store && <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>{r.preferred_store}</div>}
                      </td>
                      <td style={TD}><StatusBadge status={r.status} /></td>
                      <td style={{ ...TD, fontSize: 12, color: 'var(--ink-4)' }}>{formatDate(r.created_at)}</td>
                      <td style={TD}>
                        <span style={{ color: 'var(--gold-deep)', fontWeight: 600, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          Gerenciar <ChevronRight size={14} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
