/* global React, lucide */
const { useState, useEffect, useRef, createContext, useContext } = React;

/* ---------------- Icon (Lucide) ---------------- */
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

/* ---------------- Button ---------------- */
function Button({ variant = 'primary', size = 'md', children, onClick, disabled, full, type = 'button', style }) {
  const base = {
    fontFamily: 'var(--font-body)', fontWeight: 600, borderRadius: 'var(--r-btn)',
    border: '1px solid transparent', cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all var(--dur) var(--ease)', display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', gap: 8, width: full ? '100%' : 'auto',
    fontSize: size === 'sm' ? 13 : 15, padding: size === 'sm' ? '8px 14px' : '11px 22px',
  };
  const variants = {
    primary: { background: 'var(--gold)', color: '#fff' },
    secondary: { background: 'var(--charcoal)', color: '#fff' },
    ghost: { background: '#fff', color: 'var(--ink-1)', borderColor: 'var(--line-strong)' },
    text: { background: 'transparent', color: 'var(--gold-deep)', padding: size === 'sm' ? '6px 4px' : '8px 4px' },
  };
  const dis = disabled ? { background: 'var(--surface-2)', color: 'var(--ink-4)', borderColor: 'var(--line)' } : {};
  const [hover, setHover] = useState(false);
  const hoverStyle = !disabled && hover ? (
    variant === 'primary' ? { background: 'var(--gold-strong)', boxShadow: 'var(--shadow-gold)' } :
    variant === 'secondary' ? { background: '#262425' } :
    variant === 'ghost' ? { borderColor: 'var(--ink-3)' } :
    { color: 'var(--gold-strong)' }
  ) : {};
  return (
    <button type={type} onClick={disabled ? undefined : onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...dis, ...hoverStyle, ...style }}>
      {children}
    </button>
  );
}

/* ---------------- Badge ---------------- */
function Badge({ tone = 'gold', children }) {
  const tones = {
    gold: { background: 'var(--gold-tint)', color: 'var(--gold-deep)' },
    ok: { background: 'var(--ok-bg)', color: 'var(--ok-fg)' },
    warn: { background: 'var(--warn-bg)', color: 'var(--warn-fg)' },
    err: { background: 'var(--err-bg)', color: 'var(--err-fg)' },
    neutral: { background: 'var(--surface-2)', color: 'var(--ink-3)' },
  };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--font-body)',
      fontWeight: 600, fontSize: 11, padding: '4px 10px', borderRadius: 'var(--r-badge)', lineHeight: 1, ...tones[tone] }}>
      {children}
    </span>
  );
}

/* ---------------- Field ---------------- */
function Field({ label, type = 'text', value, onChange, placeholder, error, hint, rightIcon, onRightIcon }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--ink-2)' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <input type={type} value={value} placeholder={placeholder}
          onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: 15, padding: '10px 12px',
            paddingRight: rightIcon ? 40 : 12, borderRadius: 'var(--r-input)', background: '#fff', color: 'var(--ink-1)',
            outline: 'none', border: '1px solid ' + (error ? 'var(--err-border)' : focus ? 'var(--gold)' : 'var(--line-strong)'),
            boxShadow: focus ? '0 0 0 3px rgba(219,169,56,.20)' : error ? '0 0 0 3px rgba(162,58,47,.10)' : 'none',
            transition: 'all var(--dur) var(--ease)' }} />
        {rightIcon && (
          <button type="button" onClick={onRightIcon} tabIndex={-1}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', display: 'flex' }}>
            <Icon name={rightIcon} size={18} />
          </button>
        )}
      </div>
      {error && <span style={{ fontSize: 12, color: 'var(--err-fg)' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{hint}</span>}
    </div>
  );
}

/* ---------------- Product image placeholder ---------------- */
function ProductImage({ icon = 'shopping-bag', height = 150, radius = 0 }) {
  return (
    <div style={{ height, borderRadius: radius, background: 'linear-gradient(135deg, var(--rose-soft), var(--rose))',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rose-deep)' }}>
      <Icon name={icon} size={Math.min(56, height / 2.6)} strokeWidth={1.4} />
    </div>
  );
}

/* ---------------- Mock data ---------------- */
const CATEGORIES = [
  { id: 1, name: 'Tênis & Calçados' }, { id: 2, name: 'Roupas' },
  { id: 3, name: 'Acessórios' }, { id: 4, name: 'Beleza' }, { id: 5, name: 'Eletrônicos' },
];
const PRODUCTS = [
  { id: 1, name: 'Tênis Nike Air Max 90', desc: 'Edição importada dos EUA, couro premium.', price: 899.9, stock: 8, cat: 1, icon: 'footprints', color: 'Branco/Gold', size: '42' },
  { id: 2, name: 'Moletom Champion Reverse', desc: 'Algodão pesado, corte clássico americano.', price: 459.0, stock: 14, cat: 2, icon: 'shirt', color: 'Cinza', size: 'M' },
  { id: 3, name: 'Óculos Ray-Ban Wayfarer', desc: 'Lentes polarizadas, armação acetato.', price: 729.9, stock: 5, cat: 3, icon: 'glasses', color: 'Preto', size: 'Único' },
  { id: 4, name: 'Perfume Tom Ford Noir', desc: 'Eau de parfum 50ml, importado.', price: 1290.0, stock: 0, cat: 4, icon: 'sparkles', color: '—', size: '50ml' },
  { id: 5, name: 'Apple AirPods Pro 2', desc: 'Cancelamento de ruído, USB-C.', price: 1899.0, stock: 11, cat: 5, icon: 'headphones', color: 'Branco', size: 'Único' },
  { id: 6, name: 'Bolsa Coach Willow', desc: 'Couro genuíno, ferragem dourada.', price: 2150.0, stock: 3, cat: 3, icon: 'shopping-bag', color: 'Caramelo', size: 'Médio' },
  { id: 7, name: 'Relógio Fossil Minimalist', desc: 'Movimento quartzo, pulseira couro.', price: 689.9, stock: 7, cat: 3, icon: 'watch', color: 'Marrom', size: '42mm' },
  { id: 8, name: 'Camiseta Polo Ralph Lauren', desc: 'Piquet, bordado clássico do pônei.', price: 379.0, stock: 22, cat: 2, icon: 'shirt', color: 'Marinho', size: 'G' },
];
const BRL = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');

/* ---------------- Product card ---------------- */
function ProductCard({ product, onOpen }) {
  const [hover, setHover] = useState(false);
  const out = product.stock === 0;
  return (
    <div onClick={() => onOpen(product)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', overflow: 'hidden',
        boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)', cursor: 'pointer',
        transform: hover ? 'translateY(-3px)' : 'none', transition: 'all var(--dur) var(--ease)' }}>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform var(--dur-slow) var(--ease)' }}>
          <ProductImage icon={product.icon} height={180} />
        </div>
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--ink-1)', margin: '0 0 4px' }}>{product.name}</h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-3)', margin: '0 0 14px', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 36 }}>{product.desc}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 21, color: 'var(--ink-1)' }}>{BRL(product.price)}</span>
          <Badge tone={out ? 'err' : 'ok'}>{out ? 'Esgotado' : product.stock + ' em estoque'}</Badge>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Button, Badge, Field, ProductImage, ProductCard, CATEGORIES, PRODUCTS, BRL });
