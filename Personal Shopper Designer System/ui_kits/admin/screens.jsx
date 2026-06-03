/* global React, Icon, AdminButton, StatusBadge, StatCard, StatusBadge, REQUESTS, ADMIN_PRODUCTS, USERS, BRL, STATUS, TONE, LIFECYCLE */
const { useState: useS } = React;

const PANEL = { background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', boxShadow: 'var(--shadow-sm)' };
const TH = { textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--ink-3)', padding: '0 16px 12px' };
const TD = { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-2)', padding: '14px 16px', borderTop: '1px solid var(--line)' };

function Page({ children }) {
  return <div style={{ padding: 32, background: 'var(--surface-2)', minHeight: '100%' }}>{children}</div>;
}
function SectionLabel({ children }) {
  return <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-4)', margin: '0 0 12px' }}>{children}</p>;
}

/* ---------------- DASHBOARD ---------------- */
function Dashboard({ go }) {
  return (
    <Page>
      <SectionLabel>E-commerce</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 22 }}>
        <StatCard title="Total de Usuários" value="248" icon="users" tone="gold" />
        <StatCard title="Total de Produtos" value="64" icon="package" tone="ok" />
        <StatCard title="Total de Pedidos" value="312" icon="shopping-cart" tone="warn" />
        <StatCard title="Receita Total" value="R$ 48.290" icon="wallet" tone="gold" />
      </div>
      <SectionLabel>Solicitações de Busca</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard title="Total de Solicitações" value="142" icon="search" tone="gold" />
        <StatCard title="Solicitações Pendentes" value="18" icon="clock" tone="warn" />
        <StatCard title="Precisam de Ação" value="7" icon="alert-triangle" tone="err" />
      </div>

      {/* Quick actions */}
      <div style={{ ...PANEL, padding: 22, marginBottom: 22 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--ink-1)', margin: '0 0 16px' }}>Ações Rápidas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
          <AdminButton variant="secondary" onClick={() => go('users')}><Icon name="users" size={16} />Gerenciar Usuários</AdminButton>
          <AdminButton variant="secondary" onClick={() => go('products')}><Icon name="package" size={16} />Gerenciar Produtos</AdminButton>
          <AdminButton variant="primary" onClick={() => go('requests')}><Icon name="shopping-bag" size={16} />Ver Solicitações</AdminButton>
          <AdminButton variant="ghost" onClick={() => go('store')}><Icon name="store" size={16} />Voltar para Loja</AdminButton>
        </div>
      </div>

      {/* Recent requests */}
      <div style={{ ...PANEL, padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--ink-1)', margin: 0 }}>Solicitações Recentes</h2>
          <button onClick={() => go('requests')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: 4 }}>Ver todas<Icon name="arrow-right" size={14} /></button>
        </div>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 640, borderCollapse: 'collapse' }}>
          <thead><tr><th style={TH}>#</th><th style={TH}>Cliente</th><th style={TH}>Produto</th><th style={TH}>Status</th><th style={TH}>Data</th><th style={TH}></th></tr></thead>
          <tbody>
            {REQUESTS.slice(0, 5).map((r) => (
              <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => go('requestDetail', r)}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <td style={{ ...TD, color: 'var(--ink-4)' }}>{r.id}</td>
                <td style={TD}><div style={{ fontWeight: 600, color: 'var(--ink-1)' }}>{r.client}</div><div style={{ fontSize: 12, color: 'var(--ink-4)' }}>{r.email}</div></td>
                <td style={{ ...TD, maxWidth: 200 }}><div style={{ color: 'var(--ink-1)' }}>{r.title}</div><div style={{ fontSize: 12, color: 'var(--ink-4)' }}>{r.store}</div></td>
                <td style={TD}><StatusBadge status={r.status} /></td>
                <td style={{ ...TD, fontSize: 12, color: 'var(--ink-4)' }}>{r.date}</td>
                <td style={TD}><span style={{ color: 'var(--gold-deep)', fontWeight: 600, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 3 }}>Gerenciar<Icon name="chevron-right" size={14} /></span></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </Page>
  );
}

/* ---------------- PRODUCTS ---------------- */
function Products() {
  return (
    <Page>
      <div style={{ ...PANEL, overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
          <div style={{ position: 'relative', width: 280 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-4)', display: 'flex' }}><Icon name="search" size={16} /></span>
            <input placeholder="Buscar produtos…" style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: 14, padding: '9px 12px 9px 36px', borderRadius: 'var(--r-input)', border: '1px solid var(--line-strong)', outline: 'none' }} />
          </div>
          <AdminButton variant="primary"><Icon name="plus" size={16} />Novo Produto</AdminButton>
        </div>
        <table style={{ width: '100%', minWidth: 680, borderCollapse: 'collapse' }}>
          <thead><tr><th style={{ ...TH, paddingLeft: 20 }}>Produto</th><th style={TH}>Categoria</th><th style={TH}>Preço</th><th style={TH}>Estoque</th><th style={TH}>Status</th><th style={TH}></th></tr></thead>
          <tbody>
            {ADMIN_PRODUCTS.map((p) => (
              <tr key={p.id}>
                <td style={{ ...TD, paddingLeft: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 8, background: 'linear-gradient(135deg, var(--rose-soft), var(--rose))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rose-deep)' }}><Icon name={p.icon} size={20} strokeWidth={1.5} /></div>
                    <span style={{ fontWeight: 600, color: 'var(--ink-1)' }}>{p.name}</span>
                  </div>
                </td>
                <td style={TD}>{p.cat}</td>
                <td style={{ ...TD, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--ink-1)' }}>{BRL(p.price)}</td>
                <td style={TD}><span style={{ fontWeight: 600, color: p.stock > 0 ? 'var(--ok-fg)' : 'var(--err-fg)' }}>{p.stock > 0 ? p.stock + ' un' : 'Esgotado'}</span></td>
                <td style={TD}><Pill on={p.active} onLabel="Ativo" offLabel="Inativo" /></td>
                <td style={TD}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <IconBtn name="pencil" /><IconBtn name="trash-2" danger />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}
function Pill({ on, onLabel, offLabel }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: on ? 'var(--ok-fg)' : 'var(--ink-4)' }}><span style={{ width: 7, height: 7, borderRadius: 999, background: on ? 'var(--ok-fg)' : 'var(--ink-4)' }} />{on ? onLabel : offLabel}</span>;
}
function IconBtn({ name, danger, onClick }) {
  const [h, setH] = useS(false);
  return <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ width: 32, height: 32, borderRadius: 7, border: '1px solid var(--line)', background: h ? 'var(--surface-2)' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: danger ? 'var(--err-fg)' : 'var(--ink-3)' }}><Icon name={name} size={15} /></button>;
}

/* ---------------- USERS ---------------- */
function Users() {
  return (
    <Page>
      <div style={{ ...PANEL, overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 680, borderCollapse: 'collapse' }}>
          <thead><tr><th style={{ ...TH, paddingTop: 18, paddingLeft: 20 }}>Usuário</th><th style={{ ...TH, paddingTop: 18 }}>Email</th><th style={{ ...TH, paddingTop: 18 }}>Pedidos</th><th style={{ ...TH, paddingTop: 18 }}>Perfil</th><th style={{ ...TH, paddingTop: 18 }}></th></tr></thead>
          <tbody>
            {USERS.map((u) => (
              <tr key={u.id}>
                <td style={{ ...TD, paddingLeft: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--gold-tint)', color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14 }}>{u.name.charAt(0)}</div>
                    <span style={{ fontWeight: 600, color: 'var(--ink-1)' }}>{u.name}</span>
                  </div>
                </td>
                <td style={TD}>{u.email}</td>
                <td style={TD}>{u.orders}</td>
                <td style={TD}>{u.admin ? <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--gold-deep)', background: 'var(--gold-tint)', padding: '4px 10px', borderRadius: 999 }}>Admin</span> : <span style={{ color: 'var(--ink-3)', fontSize: 13 }}>Cliente</span>}</td>
                <td style={TD}><div style={{ display: 'flex', gap: 6 }}><IconBtn name="pencil" /><IconBtn name="trash-2" danger /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}

/* ---------------- REQUESTS LIST ---------------- */
function Requests({ go }) {
  const [filter, setFilter] = useS('todas');
  const filters = [['todas', 'Todas'], ['pendente', 'Pendentes'], ['em_busca', 'Em Busca'], ['entregue', 'Entregues']];
  const list = filter === 'todas' ? REQUESTS : REQUESTS.filter((r) => r.status === filter);
  return (
    <Page>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {filters.map(([id, l]) => (
          <button key={id} onClick={() => setFilter(id)}
            style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 999, cursor: 'pointer',
              border: '1px solid ' + (filter === id ? 'var(--gold)' : 'var(--line-strong)'),
              background: filter === id ? 'var(--gold-tint)' : '#fff', color: filter === id ? 'var(--gold-deep)' : 'var(--ink-2)' }}>{l}</button>
        ))}
      </div>
      <div style={{ ...PANEL, overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 680, borderCollapse: 'collapse' }}>
          <thead><tr><th style={{ ...TH, paddingTop: 18, paddingLeft: 20 }}>#</th><th style={{ ...TH, paddingTop: 18 }}>Cliente</th><th style={{ ...TH, paddingTop: 18 }}>Produto</th><th style={{ ...TH, paddingTop: 18 }}>Orçamento</th><th style={{ ...TH, paddingTop: 18 }}>Status</th><th style={{ ...TH, paddingTop: 18 }}>Data</th><th style={{ ...TH, paddingTop: 18 }}></th></tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => go('requestDetail', r)}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <td style={{ ...TD, paddingLeft: 20, color: 'var(--ink-4)' }}>{r.id}</td>
                <td style={TD}><div style={{ fontWeight: 600, color: 'var(--ink-1)' }}>{r.client}</div><div style={{ fontSize: 12, color: 'var(--ink-4)' }}>{r.email}</div></td>
                <td style={{ ...TD, maxWidth: 220 }}><div style={{ color: 'var(--ink-1)' }}>{r.title}</div><div style={{ fontSize: 12, color: 'var(--ink-4)' }}>{r.store} · {r.size}</div></td>
                <td style={{ ...TD, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--ink-1)' }}>{BRL(r.budget)}</td>
                <td style={TD}><StatusBadge status={r.status} /></td>
                <td style={{ ...TD, fontSize: 12, color: 'var(--ink-4)' }}>{r.date}</td>
                <td style={TD}><Icon name="chevron-right" size={16} style={{ color: 'var(--ink-4)' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}

/* ---------------- REQUEST DETAIL + TIMELINE ---------------- */
function RequestDetail({ request, go }) {
  const r = request || REQUESTS[0];
  const curIdx = LIFECYCLE.indexOf(r.status);
  return (
    <Page>
      <button onClick={() => go('requests')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--gold-deep)', marginBottom: 16, padding: 0 }}><Icon name="arrow-left" size={15} />Voltar para Solicitações</button>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 20, alignItems: 'start' }}>
        {/* Left: details + timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          <div style={{ ...PANEL, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-4)', marginBottom: 4 }}>Solicitação #{r.id}</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: 'var(--ink-1)', margin: 0 }}>{r.title}</h2>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, background: 'var(--surface-2)', borderRadius: 10, padding: 16 }}>
              <Detail label="Cliente" value={r.client} /><Detail label="Loja" value={r.store} />
              <Detail label="Orçamento" value={BRL(r.budget)} /><Detail label="Tamanho" value={r.size} />
            </div>
          </div>

          {/* Timeline */}
          <div style={{ ...PANEL, padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--ink-1)', margin: '0 0 18px' }}>Linha do Tempo</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {LIFECYCLE.map((st, i) => {
                const done = i < curIdx, current = i === curIdx;
                const last = i === LIFECYCLE.length - 1;
                return (
                  <div key={st} style={{ display: 'flex', gap: 14, minHeight: last ? 28 : 40 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 22, height: 22, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        background: done ? 'var(--gold)' : current ? '#fff' : 'var(--surface-2)',
                        border: current ? '2px solid var(--gold)' : done ? '2px solid var(--gold)' : '2px solid var(--line-strong)',
                        color: '#fff' }}>
                        {done && <Icon name="check" size={12} />}
                        {current && <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--gold)' }} />}
                      </div>
                      {!last && <div style={{ width: 2, flex: 1, background: done ? 'var(--gold)' : 'var(--line)', minHeight: 14 }} />}
                    </div>
                    <div style={{ paddingBottom: last ? 0 : 6, marginTop: 1 }}>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: current ? 700 : done ? 500 : 400,
                        color: current ? 'var(--ink-1)' : done ? 'var(--ink-2)' : 'var(--ink-4)' }}>{STATUS[st].label}</div>
                      {current && <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--gold-deep)', marginTop: 2 }}>Etapa atual · {r.date}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: admin actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 20 }}>
          <div style={{ ...PANEL, padding: 22 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--ink-1)', margin: '0 0 16px' }}>Gerenciar</h3>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--ink-3)' }}>Avançar status</label>
            <select defaultValue={r.status} style={{ width: '100%', marginTop: 6, marginBottom: 16, fontFamily: 'var(--font-body)', fontSize: 14, padding: '9px 12px', borderRadius: 'var(--r-input)', border: '1px solid var(--line-strong)', background: '#fff', color: 'var(--ink-1)' }}>
              {Object.keys(STATUS).map((k) => <option key={k} value={k}>{STATUS[k].label}</option>)}
            </select>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--ink-3)' }}>Preço cotado (R$)</label>
            <input defaultValue={r.quoted || ''} placeholder="0,00" style={{ width: '100%', marginTop: 6, marginBottom: 18, fontFamily: 'var(--font-body)', fontSize: 14, padding: '9px 12px', borderRadius: 'var(--r-input)', border: '1px solid var(--line-strong)', outline: 'none' }} />
            <AdminButton variant="primary" style={{ width: '100%', justifyContent: 'center' }}>Salvar Alterações</AdminButton>
          </div>
          <div style={{ ...PANEL, padding: 22 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--ink-1)', margin: '0 0 14px' }}>Pagamentos</h3>
            <PayRow label="Sinal (50%)" value={r.quoted ? BRL(r.quoted / 2) : '—'} done={['sinal_pago', 'sinal_confirmado', 'comprado', 'aguardando_pagamento_final', 'pago', 'entregue'].includes(r.status)} />
            <PayRow label="Final (50%)" value={r.quoted ? BRL(r.quoted / 2) : '—'} done={['pago', 'entregue'].includes(r.status)} />
            <div style={{ borderTop: '1px solid var(--line)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: 14 }}>
              <span style={{ fontWeight: 600, color: 'var(--ink-1)' }}>Total cotado</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold-deep)' }}>{r.quoted ? BRL(r.quoted) : '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
function Detail({ label, value }) {
  return <div><div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-4)', marginBottom: 3 }}>{label}</div><div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--ink-1)' }}>{value}</div></div>;
}
function PayRow({ label, value, done }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-2)' }}>
        <span style={{ width: 18, height: 18, borderRadius: 999, background: done ? 'var(--ok-bg)' : 'var(--surface-2)', color: 'var(--ok-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: done ? 'none' : '1px solid var(--line-strong)' }}>{done && <Icon name="check" size={11} />}</span>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: done ? 'var(--ink-1)' : 'var(--ink-4)' }}>{value}</span>
    </div>
  );
}

Object.assign(window, { Dashboard, Products, Users, Requests, RequestDetail });
