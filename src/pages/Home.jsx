import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Search, ArrowRight, ShoppingBag } from 'lucide-react';
import useProductStore from '../store/productStore';
import useCategoryStore from '../store/categoryStore';
import useAuthStore from '../store/authStore';

const PAGE_SIZE = 8;

function ProductCard({ product }) {
  const [hover, setHover] = useState(false);
  const out = product.stock === 0;
  return (
    <Link
      to={`/products/${product.id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#fff', border: '1px solid var(--line)',
        borderRadius: 'var(--r-card)', overflow: 'hidden',
        boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transform: hover ? 'translateY(-3px)' : 'none',
        transition: 'all var(--dur) var(--ease)',
        textDecoration: 'none', display: 'block',
      }}
    >
      <div style={{ height: 180, overflow: 'hidden', background: 'linear-gradient(135deg, var(--rose-soft), var(--rose))', position: 'relative' }}>
        {product.image_url ? (
          <img
            src={product.image_url} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform var(--dur-slow) var(--ease)' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rose-deep)' }}>
            <ShoppingBag size={48} strokeWidth={1.3} />
          </div>
        )}
        {product.category?.name && (
          <span style={{ position: 'absolute', top: 10, left: 10, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', background: 'rgba(219,169,56,.92)', color: '#fff', padding: '3px 9px', borderRadius: 999 }}>
            {product.category.name}
          </span>
        )}
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--ink-1)', margin: '0 0 4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 40 }}>{product.name}</h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-3)', margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 36, lineHeight: 1.4 }}>{product.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--ink-1)' }}>
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, padding: '4px 10px', borderRadius: 999, background: out ? 'var(--err-bg)' : 'var(--ok-bg)', color: out ? 'var(--err-fg)' : 'var(--ok-fg)' }}>
            {out ? 'Esgotado' : `${product.stock} em estoque`}
          </span>
        </div>
      </div>
    </Link>
  );
}

function CategoryCard({ category, active, onClick }) {
  const [hover, setHover] = useState(false);
  const on = active || hover;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: active ? 'var(--gold-tint)' : '#fff',
        border: `1px solid ${on ? 'var(--gold)' : 'var(--line)'}`,
        borderRadius: 'var(--r-card)', padding: '18px 14px',
        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        transition: 'all var(--dur) var(--ease)',
        boxShadow: on ? 'var(--shadow-md)' : 'none',
      }}
    >
      <span style={{ width: 44, height: 44, borderRadius: 999, background: active ? 'var(--gold)' : 'var(--gold-tint)', color: active ? '#fff' : 'var(--gold-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
        🛍️
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: active ? 'var(--gold-deep)' : 'var(--ink-1)', textAlign: 'center' }}>
        {category.name}
      </span>
    </button>
  );
}

export default function Home() {
  const { products, fetchProducts, isLoading, currentPage, totalPages } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { isAuthenticated } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const loadProducts = (newPage = 1, category = selectedCategory, search = searchTerm) => {
    fetchProducts({
      skip: (newPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      ...(category ? { category_id: category } : {}),
      ...(search ? { search } : {}),
    }).catch(() => toast.error('Erro ao carregar produtos'));
  };

  useEffect(() => {
    fetchCategories();
    loadProducts(1);
  }, []);

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchTerm('');
    setPage(1);
    loadProducts(1, categoryId, '');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadProducts(1, selectedCategory, searchTerm);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadProducts(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(120deg, var(--rose) 0%, var(--rose-soft) 60%, var(--gold-wash) 100%)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '80px 28px 88px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 18 }}>
            Personal Shopping · Importados
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(32px, 5vw, 54px)', lineHeight: 1.05, letterSpacing: '-0.01em', color: 'var(--ink-1)', margin: '0 0 18px' }}>
            Os melhores produtos<br />dos EUA, sob medida
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 540, margin: '0 auto 30px' }}>
            Compre do nosso catálogo ou solicite uma busca personalizada. Cuidamos de cada detalhe até a entrega.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/products"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, background: 'var(--gold)', color: '#fff', textDecoration: 'none', padding: '12px 26px', borderRadius: 'var(--r-btn)', transition: 'background var(--dur) var(--ease)', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-strong)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--gold)'}
            >Explorar Catálogo</Link>
            <Link
              to={isAuthenticated ? '/requests/new' : '/login'}
              style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, background: '#fff', color: 'var(--ink-1)', textDecoration: 'none', padding: '12px 26px', borderRadius: 'var(--r-btn)', border: '1px solid var(--line-strong)', transition: 'all var(--dur) var(--ease)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink-3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; }}
            >Solicitar uma Busca</Link>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '56px 28px' }}>
        {/* Busca */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 56 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-4)', display: 'flex' }}>
              <Search size={17} />
            </span>
            <input
              type="text" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produtos importados…"
              style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: 15, padding: '11px 14px 11px 42px', borderRadius: 'var(--r-input)', border: '1px solid var(--line-strong)', background: '#fff', color: 'var(--ink-1)', outline: 'none' }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(219,169,56,.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--line-strong)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <button
            type="submit"
            style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, background: 'var(--gold)', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 'var(--r-btn)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background var(--dur) var(--ease)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-strong)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--gold)'}
          ><Search size={16} />Buscar</button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setPage(1); loadProducts(1, selectedCategory, ''); }}
              style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, background: '#fff', color: 'var(--ink-2)', border: '1px solid var(--line-strong)', padding: '11px 16px', borderRadius: 'var(--r-btn)', cursor: 'pointer' }}
            >Limpar</button>
          )}
        </form>

        {/* Categorias */}
        {categories.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 6 }}>Navegue</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28, color: 'var(--ink-1)', margin: 0 }}>Categorias</h2>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(130px, 1fr))`, gap: 14 }}>
              <CategoryCard category={{ name: 'Todas' }} active={selectedCategory === null} onClick={() => handleCategoryFilter(null)} />
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} active={selectedCategory === cat.id} onClick={() => handleCategoryFilter(cat.id)} />
              ))}
            </div>
          </section>
        )}

        {/* Produtos */}
        <section>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 6 }}>Seleção</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28, color: 'var(--ink-1)', margin: 0 }}>
                {searchTerm ? `Resultados para "${searchTerm}"` : 'Em Destaque'}
              </h2>
            </div>
            <Link
              to="/products"
              style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--gold-deep)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-strong)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gold-deep)'}
            >Ver todos <ArrowRight size={15} /></Link>
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
              <div className="ps-spin" style={{ width: 36, height: 36, borderRadius: 999, border: '3px solid var(--gold-tint)', borderTopColor: 'var(--gold)' }} />
            </div>
          ) : products.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', padding: '56px 24px', textAlign: 'center' }}>
              <ShoppingBag size={48} strokeWidth={1.3} style={{ color: 'var(--rose-deep)', marginBottom: 16 }} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--ink-3)', margin: 0 }}>Nenhum produto encontrado</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 22 }}>
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40 }}>
              <button
                onClick={() => handlePageChange(page - 1)} disabled={page <= 1}
                style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, padding: '9px 16px', borderRadius: 'var(--r-btn)', border: '1px solid var(--line-strong)', background: '#fff', color: 'var(--ink-2)', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.4 : 1 }}
              >← Anterior</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => handlePageChange(p)}
                  style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, width: 40, height: 40, borderRadius: 'var(--r-btn)', border: `1px solid ${p === page ? 'var(--gold)' : 'var(--line-strong)'}`, background: p === page ? 'var(--gold)' : '#fff', color: p === page ? '#fff' : 'var(--ink-2)', cursor: 'pointer' }}
                >{p}</button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}
                style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, padding: '9px 16px', borderRadius: 'var(--r-btn)', border: '1px solid var(--line-strong)', background: '#fff', color: 'var(--ink-2)', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.4 : 1 }}
              >Próxima →</button>
            </div>
          )}
        </section>
      </div>

      {/* CTA Banner */}
      <section style={{ background: 'var(--charcoal)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '56px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Não encontrou?</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 28, color: '#fff', margin: '0 0 8px' }}>Peça uma busca personalizada</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,.6)', margin: 0, maxWidth: 460 }}>
              Diga o que procura — loja, referência, orçamento — e nosso personal shopper encontra para você.
            </p>
          </div>
          <Link
            to={isAuthenticated ? '/requests/new' : '/login'}
            style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, background: 'var(--gold)', color: '#fff', textDecoration: 'none', padding: '13px 28px', borderRadius: 'var(--r-btn)', transition: 'all var(--dur) var(--ease)', whiteSpace: 'nowrap', boxShadow: 'var(--shadow-gold)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-strong)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--gold)'}
          >Nova Solicitação</Link>
        </div>
      </section>
    </div>
  );
}
