import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingBag, ChevronLeft, ChevronRight, Store } from 'lucide-react';
import useAuthStore from '../store/authStore';

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { path: '/admin/users',     label: 'Usuários',   Icon: Users },
  { path: '/admin/products',  label: 'Produtos',   Icon: Package },
  { path: '/admin/requests',  label: 'Solicitações', Icon: ShoppingBag },
];

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path) => location.pathname === path || (path === '/admin/requests' && location.pathname.startsWith('/admin/requests'));

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--surface-2)' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 76 : 248,
        background: 'var(--charcoal)', color: '#fff',
        display: 'flex', flexDirection: 'column',
        transition: 'width var(--dur) var(--ease)', flexShrink: 0,
      }}>
        {/* Header */}
        <div style={{ padding: '18px', borderBottom: '1px solid rgba(255,255,255,.10)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 68 }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gold)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>PS</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, whiteSpace: 'nowrap' }}>Admin</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', cursor: 'pointer', display: 'flex', padding: 6, borderRadius: 6, marginLeft: collapsed ? 'auto' : 0 }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {menuItems.map(({ path, label, Icon }) => {
            const on = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                title={collapsed ? label : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 13,
                  padding: collapsed ? '11px' : '11px 14px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 8, border: 'none', cursor: 'pointer', textDecoration: 'none',
                  fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: on ? 600 : 500,
                  background: on ? 'var(--gold)' : 'transparent',
                  color: on ? '#fff' : 'rgba(255,255,255,.66)',
                  transition: 'all var(--dur) var(--ease)',
                }}
                onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'rgba(255,255,255,.07)'; }}
                onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={19} strokeWidth={on ? 2 : 1.8} />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: 14, borderTop: '1px solid rgba(255,255,255,.10)' }}>
          {!collapsed && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,.4)', marginBottom: 2 }}>Logado como</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.full_name || user?.email}
              </div>
            </div>
          )}
          <Link
            to="/"
            title={collapsed ? 'Ver Loja' : undefined}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '9px', borderRadius: 8, border: '1px solid rgba(255,255,255,.18)',
              background: 'transparent', color: 'rgba(255,255,255,.8)', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, textDecoration: 'none',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,.07)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Store size={16} />
            {!collapsed && 'Ver Loja'}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--line)', padding: '0 32px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexShrink: 0 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--ink-1)', margin: 0 }}>Painel de Administração</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-2)' }}>{user?.full_name || user?.email}</span>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--charcoal)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <button
              onClick={handleLogout}
              style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--err-fg)', background: 'none', border: '1px solid var(--err-border)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--err-bg)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >Sair</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
