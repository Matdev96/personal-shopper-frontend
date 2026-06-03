/* global React, Icon, AdminButton */
const { useState: useCh } = React;

function Sidebar({ route, go, collapsed, setCollapsed }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'users', label: 'Usuários', icon: 'users' },
    { id: 'products', label: 'Produtos', icon: 'package' },
    { id: 'requests', label: 'Solicitações', icon: 'shopping-bag' },
  ];
  const active = (id) => route === id || (id === 'requests' && route === 'requestDetail');
  return (
    <aside style={{ width: collapsed ? 76 : 248, background: 'var(--charcoal)', color: '#fff', display: 'flex',
      flexDirection: 'column', transition: 'width var(--dur) var(--ease)', flexShrink: 0 }}>
      <div style={{ padding: '18px 18px', borderBottom: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gold)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>PS</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>Admin</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', cursor: 'pointer', display: 'flex', padding: 6, borderRadius: 6 }}>
          <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size={18} />
        </button>
      </div>
      <nav style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((it) => {
          const on = active(it.id);
          return (
            <button key={it.id} onClick={() => go(it.id)} title={it.label}
              style={{ display: 'flex', alignItems: 'center', gap: 13, padding: collapsed ? '11px' : '11px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: on ? 600 : 500,
                background: on ? 'var(--gold)' : 'transparent', color: on ? '#fff' : 'rgba(255,255,255,.66)',
                transition: 'all var(--dur) var(--ease)' }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'rgba(255,255,255,.07)'; }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
              <Icon name={it.icon} size={19} />
              {!collapsed && <span>{it.label}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: 14, borderTop: '1px solid rgba(255,255,255,.1)' }}>
        {!collapsed && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,.4)' }}>Logado como</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#fff' }}>Administrador</div>
          </div>
        )}
        <button onClick={() => go('store')} title="Voltar para Loja"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px',
            borderRadius: 8, border: '1px solid rgba(255,255,255,.18)', background: 'transparent', color: 'rgba(255,255,255,.8)',
            cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500 }}>
          <Icon name="store" size={16} />{!collapsed && 'Voltar para Loja'}
        </button>
      </div>
    </aside>
  );
}

function Topbar({ title, subtitle, actions }) {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid var(--line)', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--ink-1)', margin: 0, whiteSpace: 'nowrap' }}>{title}</h1>
        {subtitle && <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-3)', margin: '3px 0 0' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {actions}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-2)' }}>Administrador</span>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--charcoal)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>A</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar });
