/* global React, ReactDOM, Header, Footer, Home, Catalog, ProductDetail, Cart, Login, Icon, Button, PRODUCTS */
const { useState: useApp } = React;

function Toast({ toast }) {
  if (!toast) return null;
  const err = toast.type === 'error';
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 200,
      display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid var(--line)',
      borderLeft: '3px solid ' + (err ? 'var(--err-fg)' : 'var(--ok-fg)'), borderRadius: 10, boxShadow: 'var(--shadow-lg)',
      padding: '13px 18px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-1)', animation: 'slidein .25s ease' }}>
      <span style={{ color: err ? 'var(--err-fg)' : 'var(--ok-fg)', display: 'flex' }}><Icon name={err ? 'alert-circle' : 'check-circle-2'} size={18} /></span>
      {toast.msg}
    </div>
  );
}

function Placeholder({ title, icon, go }) {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '70vh' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '80px 28px', textAlign: 'center' }}>
        <div style={{ color: 'var(--rose-deep)', display: 'flex', justifyContent: 'center', marginBottom: 18 }}><Icon name={icon} size={56} strokeWidth={1.3} /></div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, color: 'var(--ink-1)', margin: '0 0 10px' }}>{title}</h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-3)', margin: '0 0 24px' }}>Esta área faz parte do fluxo completo do produto. Veja o kit Admin para a gestão de solicitações.</p>
        <Button variant="ghost" onClick={() => go('home')}>Voltar para Home</Button>
      </div>
    </div>
  );
}

function App() {
  const [route, setRoute] = useApp('home');
  const [current, setCurrent] = useApp(null);
  const [cart, setCart] = useApp([]);
  const [user, setUser] = useApp(null);
  const [toast, setToast] = useApp(null);

  const fireToast = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 2400); };
  const go = (r, payload) => { if (payload) setCurrent(payload); setRoute(r); window.scrollTo({ top: 0 }); };

  const addToCart = (p, qty = 1) => {
    if (!user) { fireToast('Faça login para adicionar ao carrinho', 'error'); go('login'); return; }
    setCart((c) => {
      const ex = c.find((i) => i.id === p.id);
      if (ex) return c.map((i) => i.id === p.id ? { ...i, qty: i.qty + qty } : i);
      return [...c, { id: p.id, name: p.name, price: p.price, icon: p.icon, color: p.color, qty }];
    });
    fireToast(p.name + ' adicionado ao carrinho!');
  };
  const updateQty = (id, q) => { if (q <= 0) return removeItem(id); setCart((c) => c.map((i) => i.id === id ? { ...i, qty: q } : i)); };
  const removeItem = (id) => { setCart((c) => c.filter((i) => i.id !== id)); fireToast('Item removido do carrinho!'); };
  const login = () => { setUser({ name: 'Ana Beatriz', email: 'ana@email.com' }); fireToast('Login realizado com sucesso!'); go('home'); };
  const logout = () => { setUser(null); setCart([]); fireToast('Logout realizado com sucesso!'); go('home'); };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const isLogin = route === 'login';

  let screen;
  if (route === 'home') screen = <Home go={go} user={user} addToCart={addToCart} />;
  else if (route === 'catalog') screen = <Catalog go={go} />;
  else if (route === 'product') screen = <ProductDetail product={current} go={go} addToCart={addToCart} />;
  else if (route === 'cart') screen = <Cart items={cart} go={go} updateQty={updateQty} removeItem={removeItem} />;
  else if (route === 'login') screen = <Login go={go} onLogin={login} />;
  else if (route === 'checkout') screen = <Placeholder title="Checkout" icon="credit-card" go={go} />;
  else if (route === 'orders') screen = <Placeholder title="Meus Pedidos" icon="package" go={go} />;
  else if (route === 'requests') screen = <Placeholder title="Minhas Solicitações" icon="search" go={go} />;
  else if (route === 'profile') screen = <Placeholder title="Meu Perfil" icon="user" go={go} />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header route={route} go={go} cartCount={cartCount} user={user} onLogout={logout} />
      <div style={{ flex: 1 }}>{screen}</div>
      {!isLogin && <Footer go={go} />}
      <Toast toast={toast} />
    </div>
  );
}

function mount() { ReactDOM.createRoot(document.getElementById('root')).render(<App />); }
if (document.fonts && document.fonts.load) {
  Promise.all([
    document.fonts.load('700 40px "Playfair Display"'),
    document.fonts.load('600 40px "Playfair Display"'),
    document.fonts.load('400 16px "Inter"'),
    document.fonts.load('600 16px "Inter"'),
  ]).then(mount).catch(mount);
  setTimeout(() => { if (!document.getElementById('root').hasChildNodes()) mount(); }, 1500);
} else { mount(); }
