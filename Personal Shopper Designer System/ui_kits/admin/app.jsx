/* global React, ReactDOM, Sidebar, Topbar, Dashboard, Products, Users, Requests, RequestDetail */
const { useState: useApp } = React;

const META = {
  dashboard: ['Dashboard', 'Visão geral da loja e solicitações'],
  users: ['Usuários', 'Gerenciar contas de clientes'],
  products: ['Produtos', 'Catálogo e estoque'],
  requests: ['Solicitações', 'Buscas personalizadas dos clientes'],
  requestDetail: ['Detalhe da Solicitação', 'Avançar status, cotar e revisar pagamentos'],
};

function App() {
  const [route, setRoute] = useApp('dashboard');
  const [current, setCurrent] = useApp(null);
  const [collapsed, setCollapsed] = useApp(false);

  const go = (r, payload) => {
    if (r === 'store') { window.location.href = '../storefront/index.html'; return; }
    if (payload) setCurrent(payload);
    setRoute(r);
  };

  let screen;
  if (route === 'dashboard') screen = <Dashboard go={go} />;
  else if (route === 'users') screen = <Users />;
  else if (route === 'products') screen = <Products />;
  else if (route === 'requests') screen = <Requests go={go} />;
  else if (route === 'requestDetail') screen = <RequestDetail request={current} go={go} />;

  const [title, subtitle] = META[route];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--surface-2)' }}>
      <Sidebar route={route} go={go} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar title={title} subtitle={subtitle} />
        <div style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>{screen}</div>
      </div>
    </div>
  );
}

function mount() { ReactDOM.createRoot(document.getElementById('root')).render(<App />); }
if (document.fonts && document.fonts.load) {
  Promise.all([
    document.fonts.load('700 28px "Playfair Display"'),
    document.fonts.load('600 18px "Playfair Display"'),
    document.fonts.load('400 14px "Inter"'),
    document.fonts.load('600 14px "Inter"'),
  ]).then(mount).catch(mount);
  setTimeout(() => { if (!document.getElementById('root').hasChildNodes()) mount(); }, 1500);
} else { mount(); }
