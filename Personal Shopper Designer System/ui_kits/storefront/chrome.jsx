/* global React, Icon, Button */
const { useState: useS2 } = React;

function Header({ route, go, cartCount, user, onLogout }) {
  const [menu, setMenu] = useS2(false);
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'catalog', label: 'Produtos' },
    ...(user ? [{ id: 'orders', label: 'Pedidos' }, { id: 'requests', label: 'Solicitações' }] : []),
  ];
  const link = (active) => ({
    fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: active ? 600 : 500, cursor: 'pointer',
    color: active ? 'var(--gold-deep)' : 'var(--ink-2)', background: 'none', border: 'none',
    padding: 0, transition: 'color var(--dur) var(--ease)',
  });
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.92)',
      backdropFilter: 'blur(10px)', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '13px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, background: 'var(--charcoal)', color: 'var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>PS</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--ink-1)' }}>Personal Shopper</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {navItems.map((n) => (
            <button key={n.id} style={link(route === n.id)} onClick={() => go(n.id)}>{n.label}</button>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button onClick={() => go('cart')} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-1)', display: 'flex' }}>
            <Icon name="shopping-bag" size={21} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: -7, right: -8, background: 'var(--gold)', color: '#fff',
                fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-body)', width: 17, height: 17, borderRadius: 999,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
            )}
          </button>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setMenu(!menu)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-1)' }}>
                <span style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--gold-tint)', color: 'var(--gold-deep)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13 }}>
                  {user.name.charAt(0)}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
              </button>
              {menu && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 190, background: '#fff',
                  borderRadius: 10, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--line)', overflow: 'hidden', padding: '6px 0' }}>
                  {[['Meu Perfil', 'profile'], ['Meus Pedidos', 'orders'], ['Minhas Solicitações', 'requests']].map(([l, r]) => (
                    <button key={r} onClick={() => { setMenu(false); go(r); }}
                      style={{ width: '100%', textAlign: 'left', padding: '9px 16px', background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-2)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>{l}</button>
                  ))}
                  <button onClick={() => { setMenu(false); onLogout(); }}
                    style={{ width: '100%', textAlign: 'left', padding: '9px 16px', background: 'none', border: 'none', borderTop: '1px solid var(--line)', cursor: 'pointer',
                      fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--err-fg)' }}>Sair</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button style={link(false)} onClick={() => go('login')}>Entrar</button>
              <Button size="sm" onClick={() => go('login')}>Registrar</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer({ go }) {
  const col = (title, links) => (
    <div>
      <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: '#fff', margin: '0 0 14px' }}>{title}</h4>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {links.map((l) => (
          <li key={l[0]}><button onClick={() => l[1] && go(l[1])}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left',
              fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,.62)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,.62)'}>{l[0]}</button></li>
        ))}
      </ul>
    </div>
  );
  return (
    <footer style={{ background: 'var(--charcoal)', marginTop: 64 }}>
      <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '52px 28px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 32, marginBottom: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gold)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>PS</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: '#fff' }}>Personal Shopper</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,.55)', maxWidth: 260, margin: 0 }}>
              Sua loja de produtos importados dos EUA. Qualidade, variedade e entrega rápida — com o toque de um personal shopper.
            </p>
          </div>
          {col('Loja', [['Home', 'home'], ['Produtos', 'catalog'], ['Carrinho', 'cart']])}
          {col('Conta', [['Entrar', 'login'], ['Meus Pedidos', 'orders'], ['Solicitações', 'requests']])}
          {col('Contato', [['contato@personalshopper.com'], ['(11) 99999-9999'], ['São Paulo, SP']])}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,.4)' }}>© {new Date().getFullYear()} Personal Shopper. Todos os direitos reservados.</span>
          <div style={{ display: 'flex', gap: 16, color: 'rgba(255,255,255,.55)' }}>
            <Social path="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.06.42 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.37-2.23.42-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.42-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.17-.42-.37-1.06-.42-2.23C2.2 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.37 2.23-.42C8.42 2.2 8.8 2.2 12 2.2zm0 3.3a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm0 10.72a4.22 4.22 0 110-8.44 4.22 4.22 0 010 8.44zm6.78-10.97a1.52 1.52 0 11-3.04 0 1.52 1.52 0 013.04 0z" />
            <Social path="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z" />
            <Social path="M18.9 2H22l-7.1 8.1L23.2 22h-6.6l-5.18-6.78L5.5 22H2.4l7.6-8.68L1.2 2h6.77l4.68 6.19L18.9 2zm-1.15 18h1.83L7.3 3.9H5.34L17.75 20z" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function Social({ path }) {
  return (
    <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'rgba(255,255,255,.55)', display: 'flex', transition: 'color var(--dur) var(--ease)' }}
      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,.55)'}>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
    </a>
  );
}

Object.assign(window, { Header, Footer, Social });
