/* global React, Icon, Button, Badge, Field, ProductImage, ProductCard, CATEGORIES, PRODUCTS, BRL */
const { useState: useSc } = React;

/* ---------------- HOME ---------------- */
function Home({ go, user, addToCart }) {
  const featured = PRODUCTS.slice(0, 4);
  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(120deg, var(--rose) 0%, var(--rose-soft) 60%, var(--gold-wash) 100%)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '80px 28px 88px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 18 }}>Personal Shopping · Importados</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 54, lineHeight: 1.05, letterSpacing: '-0.01em', color: 'var(--ink-1)', margin: '0 0 18px' }}>
            Os melhores produtos<br />dos EUA, sob medida
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 540, margin: '0 auto 30px' }}>
            Compre do nosso catálogo ou solicite uma busca personalizada. Cuidamos de cada detalhe até a entrega.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <Button onClick={() => go('catalog')}>Explorar Catálogo</Button>
            <Button variant="ghost" onClick={() => go(user ? 'requests' : 'login')}>Solicitar uma Busca</Button>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '56px 28px' }}>
        {/* Search */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 48 }}>
          <div style={{ flex: 1 }}><Field placeholder="Buscar produtos importados…" value="" onChange={() => {}} /></div>
          <Button onClick={() => go('catalog')}><Icon name="search" size={17} />Buscar</Button>
        </div>

        {/* Categories */}
        <SectionHeader eyebrow="Navegue" title="Categorias" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 56 }}>
          {CATEGORIES.map((c, i) => (
            <button key={c.id} onClick={() => go('catalog')}
              style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', padding: '22px 14px',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transition: 'all var(--dur) var(--ease)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <span style={{ width: 46, height: 46, borderRadius: 999, background: 'var(--gold-tint)', color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={['footprints', 'shirt', 'gem', 'sparkles', 'smartphone'][i]} size={22} />
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--ink-1)', textAlign: 'center' }}>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Featured */}
        <SectionHeader eyebrow="Seleção" title="Em destaque" action="Ver todos" onAction={() => go('catalog')} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
          {featured.map((p) => <ProductCard key={p.id} product={p} onOpen={() => go('product', p)} />)}
        </div>
      </div>

      {/* CTA banner */}
      <section style={{ background: 'var(--charcoal)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '56px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Não encontrou?</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 30, color: '#fff', margin: '0 0 8px' }}>Peça uma busca personalizada</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,.6)', margin: 0, maxWidth: 460 }}>
              Diga o que procura — loja, referência, orçamento — e nosso personal shopper encontra para você.
            </p>
          </div>
          <Button onClick={() => go(user ? 'requests' : 'login')}>Nova Solicitação</Button>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
      <div>
        {eyebrow && <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 6 }}>{eyebrow}</div>}
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28, color: 'var(--ink-1)', margin: 0, whiteSpace: 'nowrap' }}>{title}</h2>
      </div>
      {action && <button onClick={onAction} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: 5 }}>{action}<Icon name="arrow-right" size={15} /></button>}
    </div>
  );
}

/* ---------------- CATALOG ---------------- */
function Catalog({ go }) {
  const [cat, setCat] = useSc(null);
  const [price, setPrice] = useSc(2500);
  const list = PRODUCTS.filter((p) => (!cat || p.cat === cat) && p.price <= price);
  return (
    <div style={{ background: 'var(--bg)', minHeight: '70vh' }}>
      <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '40px 28px 64px' }}>
        <Breadcrumb go={go} trail={[['Home', 'home'], ['Produtos']]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 38, color: 'var(--ink-1)', margin: '8px 0 28px' }}>Catálogo</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '248px 1fr', gap: 32, alignItems: 'start' }}>
          {/* Sidebar filters */}
          <aside style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', padding: 22, position: 'sticky', top: 88 }}>
            <FilterGroup title="Categorias">
              <FilterRow active={cat === null} label="Todas" onClick={() => setCat(null)} />
              {CATEGORIES.map((c) => <FilterRow key={c.id} active={cat === c.id} label={c.name} onClick={() => setCat(c.id)} />)}
            </FilterGroup>
            <div style={{ height: 1, background: 'var(--line)', margin: '18px 0' }} />
            <FilterGroup title="Preço máximo">
              <input type="range" min="200" max="2500" step="50" value={price} onChange={(e) => setPrice(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--gold)' }} />
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--gold-deep)', marginTop: 6 }}>{BRL(price)}</div>
            </FilterGroup>
          </aside>
          {/* Grid */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-3)' }}>{list.length} produtos</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
              {list.map((p) => <ProductCard key={p.id} product={p} onOpen={() => go('product', p)} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function FilterGroup({ title, children }) {
  return (<div><div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: 'var(--ink-1)', marginBottom: 12 }}>{title}</div><div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</div></div>);
}
function FilterRow({ active, label, onClick }) {
  return (<button onClick={onClick} style={{ textAlign: 'left', background: active ? 'var(--gold-tint)' : 'none', border: 'none', borderRadius: 6, padding: '7px 10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: active ? 600 : 400, color: active ? 'var(--gold-deep)' : 'var(--ink-2)' }}>{label}</button>);
}

/* ---------------- PRODUCT DETAIL ---------------- */
function ProductDetail({ product, go, addToCart }) {
  const [qty, setQty] = useSc(1);
  const p = product || PRODUCTS[0];
  const out = p.stock === 0;
  return (
    <div style={{ background: 'var(--bg)', minHeight: '70vh' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '40px 28px 64px' }}>
        <Breadcrumb go={go} trail={[['Home', 'home'], ['Produtos', 'catalog'], [p.name]]} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start', background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', padding: 32, marginTop: 12, boxShadow: 'var(--shadow-sm)' }}>
          <ProductImage icon={p.icon} height={460} radius={10} />
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 10 }}>{CATEGORIES.find((c) => c.id === p.cat)?.name}</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 30, lineHeight: 1.22, color: 'var(--ink-1)', margin: '0 0 16px', textWrap: 'balance' }}>{p.name}</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.6, color: 'var(--ink-2)', margin: '0 0 22px' }}>{p.desc} Produto original, com nota fiscal e garantia. Importação cuidada do início ao fim.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, background: 'var(--surface-2)', borderRadius: 10, padding: 18, marginBottom: 24 }}>
              <Spec label="Cor" value={p.color} /><Spec label="Tamanho" value={p.size} />
              <Spec label="Estoque" value={out ? 'Fora de estoque' : p.stock + ' unidades'} tone={out ? 'err' : 'ok'} />
              <Spec label="Entrega" value="5–9 dias úteis" />
            </div>
            <div style={{ marginTop: 8, borderTop: '1px solid var(--line)', paddingTop: 22 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-3)', marginBottom: 4 }}>Preço</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 42, color: 'var(--ink-1)', marginBottom: 20 }}>{BRL(p.price)}</div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-strong)', borderRadius: 'var(--r-btn)', overflow: 'hidden' }}>
                  <QtyBtn onClick={() => setQty(Math.max(1, qty - 1))}>−</QtyBtn>
                  <span style={{ width: 44, textAlign: 'center', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15 }}>{qty}</span>
                  <QtyBtn onClick={() => setQty(qty + 1)}>+</QtyBtn>
                </div>
                <Button full disabled={out} onClick={() => addToCart(p, qty)}><Icon name="shopping-bag" size={17} />{out ? 'Indisponível' : 'Adicionar ao Carrinho'}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Spec({ label, value, tone }) {
  return (<div><div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-3)', marginBottom: 3 }}>{label}</div><div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: tone === 'err' ? 'var(--err-fg)' : tone === 'ok' ? 'var(--ok-fg)' : 'var(--ink-1)' }}>{value}</div></div>);
}
function QtyBtn({ children, onClick }) {
  return (<button onClick={onClick} style={{ width: 38, height: 40, background: 'var(--surface-2)', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--ink-1)' }}>{children}</button>);
}

/* ---------------- CART ---------------- */
function Cart({ items, go, updateQty, removeItem }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  if (items.length === 0) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '70vh' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '40px 28px' }}>
          <Breadcrumb go={go} trail={[['Home', 'home'], ['Carrinho']]} />
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', padding: '64px 24px', textAlign: 'center', marginTop: 12 }}>
            <div style={{ color: 'var(--rose-deep)', marginBottom: 18, display: 'flex', justifyContent: 'center' }}><Icon name="shopping-bag" size={64} strokeWidth={1.3} /></div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26, color: 'var(--ink-1)', margin: '0 0 10px' }}>Seu carrinho está vazio</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-3)', margin: '0 0 24px' }}>Adicione alguns produtos para começar suas compras!</p>
            <Button onClick={() => go('catalog')}>Continuar Comprando</Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ background: 'var(--bg)', minHeight: '70vh' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '40px 28px 64px' }}>
        <Breadcrumb go={go} trail={[['Home', 'home'], ['Carrinho']]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 38, color: 'var(--ink-1)', margin: '8px 0 28px' }}>Seu Carrinho</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
            {items.map((it, idx) => (
              <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto auto', gap: 16, alignItems: 'center', padding: 18, borderTop: idx ? '1px solid var(--line)' : 'none' }}>
                <div style={{ borderRadius: 8, overflow: 'hidden' }}><ProductImage icon={it.icon} height={64} /></div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--ink-1)' }}>{it.name}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-3)' }}>{BRL(it.price)} · {it.color}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-strong)', borderRadius: 6, overflow: 'hidden' }}>
                  <QtyBtn onClick={() => updateQty(it.id, it.qty - 1)}>−</QtyBtn>
                  <span style={{ width: 36, textAlign: 'center', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>{it.qty}</span>
                  <QtyBtn onClick={() => updateQty(it.id, it.qty + 1)}>+</QtyBtn>
                </div>
                <div style={{ textAlign: 'right', minWidth: 120 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--ink-1)' }}>{BRL(it.price * it.qty)}</div>
                  <button onClick={() => removeItem(it.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--err-fg)', marginTop: 2 }}>Remover</button>
                </div>
              </div>
            ))}
          </div>
          {/* Summary */}
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', padding: 24, position: 'sticky', top: 88, boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: 'var(--ink-1)', margin: '0 0 20px' }}>Resumo do Pedido</h2>
            <Row label={`Subtotal (${items.length} itens)`} value={BRL(total)} />
            <Row label="Frete" value="Grátis" valueColor="var(--ok-fg)" />
            <div style={{ height: 1, background: 'var(--line)', margin: '14px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 17, color: 'var(--ink-1)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: 'var(--gold-deep)', whiteSpace: 'nowrap' }}>{BRL(total)}</span>
            </div>
            <Button full onClick={() => go('checkout')}>Ir para Checkout</Button>
            <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {['Frete grátis acima de R$ 100', 'Parcelamento em até 12x sem juros', 'Garantia de satisfação'].map((t) => (
                <div key={t} style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-3)' }}><Icon name="check" size={14} style={{ color: 'var(--gold-deep)' }} />{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Row({ label, value, valueColor }) {
  return (<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-2)' }}><span>{label}</span><span style={{ fontWeight: 600, color: valueColor || 'var(--ink-1)' }}>{value}</span></div>);
}

/* ---------------- LOGIN (split) ---------------- */
function Login({ go, onLogin }) {
  const [show, setShow] = useSc(false);
  const [email, setEmail] = useSc('ana@email.com');
  const [pass, setPass] = useSc('••••••••');
  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left brand panel */}
      <div style={{ background: 'linear-gradient(150deg, var(--charcoal), #28262700)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(150deg, #2c2a2b, #3a3637)' }} />
        <div style={{ position: 'relative', padding: '64px 56px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 40, height: 40, borderRadius: 9, background: 'var(--gold)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>PS</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: '#fff' }}>Personal Shopper</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Bem-vindo de volta</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 38, lineHeight: 1.15, color: '#fff', margin: 0, maxWidth: 380 }}>Os melhores importados, escolhidos a dedo.</h2>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,.5)', margin: 0 }}>Entre para acompanhar pedidos e solicitações de busca.</p>
        </div>
      </div>
      {/* Right form */}
      <div style={{ background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 380, background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', padding: 36, boxShadow: 'var(--shadow-md)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--ink-1)', margin: '0 0 6px', textAlign: 'center' }}>Entrar</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-3)', textAlign: 'center', margin: '0 0 24px' }}>Acesse sua conta</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
            <div>
              <Field label="Senha" type={show ? 'text' : 'password'} value={pass} onChange={(e) => setPass(e.target.value)} rightIcon={show ? 'eye-off' : 'eye'} onRightIcon={() => setShow(!show)} />
              <div style={{ textAlign: 'right', marginTop: 6 }}><button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gold-deep)' }}>Esqueceu a senha?</button></div>
            </div>
            <Button full onClick={onLogin}>Entrar</Button>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-3)', textAlign: 'center', marginTop: 20 }}>
            Não tem conta? <button onClick={onLogin} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--gold-deep)' }}>Registre-se aqui</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Breadcrumb({ trail, go }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 13 }}>
      {trail.map((t, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: 'var(--ink-4)' }}>/</span>}
          {t[1] ? <button onClick={() => go(t[1])} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gold-deep)' }}>{t[0]}</button>
            : <span style={{ color: 'var(--ink-2)', fontWeight: 600 }}>{t[0]}</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

Object.assign(window, { Home, Catalog, ProductDetail, Cart, Login });
