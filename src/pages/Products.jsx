import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Search, ShoppingBag } from 'lucide-react';
import useProductStore from '../store/productStore';
import useCategoryStore from '../store/categoryStore';

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
          <img src={product.image_url} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform var(--dur-slow) var(--ease)' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rose-deep)' }}>
            <ShoppingBag size={48} strokeWidth={1.3} />
          </div>
        )}
        {product.category?.name && (
          <span style={{ position: 'absolute', top: 10, left: 10, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', background: 'rgba(219,169,56,.92)', color: '#fff', padding: '3px 9px', borderRadius: 999 }}>
            {product.category.name}
          </span>
        )}
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--ink-1)', margin: '0 0 4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 40 }}>{product.name}</h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-3)', margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4, minHeight: 36 }}>{product.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--ink-1)' }}>
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, padding: '4px 10px', borderRadius: 999, background: out ? 'var(--err-bg)' : 'var(--ok-bg)', color: out ? 'var(--err-fg)' : 'var(--ok-fg)' }}>
            {out ? 'Esgotado' : 'Em estoque'}
          </span>
        </div>
      </div>
    </Link>
  );
}

function FilterRow({ active, label, onClick }) {
  return (
    <button onClick={onClick}
      style={{ textAlign: 'left', background: active ? 'var(--gold-tint)' : 'none', border: 'none', borderRadius: 6, padding: '8px 10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: active ? 600 : 400, color: active ? 'var(--gold-deep)' : 'var(--ink-2)', width: '100%', transition: 'all var(--dur) var(--ease)' }}
    >{label}</button>
  );
}

export default function Products() {
  const { products, fetchProducts, searchProducts, filterByCategory, filterByPrice, isLoading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;

  useEffect(() => { fetchCategories(); fetchProducts({ limit: pageSize }); }, []);

  const handleSearch = async (e) => {
    e.preventDefault(); setCurrentPage(0);
    if (!searchTerm.trim()) { await fetchProducts({ limit: pageSize }); return; }
    try { await searchProducts(searchTerm, { limit: pageSize }); } catch { toast.error('Erro ao buscar produtos'); }
  };

  const handleCategoryFilter = async (categoryId) => {
    setCurrentPage(0); setSelectedCategory(categoryId);
    try {
      if (categoryId) await filterByCategory(categoryId, { limit: pageSize });
      else await fetchProducts({ limit: pageSize });
    } catch { toast.error('Erro ao filtrar por categoria'); }
  };

  const handlePriceFilter = async () => {
    setCurrentPage(0);
    try { await filterByPrice(priceRange.min, priceRange.max, { limit: pageSize }); } catch { toast.error('Erro ao filtrar por preço'); }
  };

  const handleStockFilter = async () => {
    setCurrentPage(0); setInStockOnly(!inStockOnly);
    try {
      if (!inStockOnly) await useProductStore.getState().filterInStock({ limit: pageSize });
      else await fetchProducts({ limit: pageSize });
    } catch { toast.error('Erro ao filtrar por estoque'); }
  };

  const handleSort = async (field, order) => {
    setSortBy(field); setSortOrder(order); setCurrentPage(0);
    try { await fetchProducts({ limit: pageSize, sort_by: field, sort_order: order }); } catch { toast.error('Erro ao ordenar'); }
  };

  const selectStyle = {
    fontFamily: 'var(--font-body)', fontSize: 14, padding: '9px 12px',
    borderRadius: 'var(--r-input)', border: '1px solid var(--line-strong)',
    background: '#fff', color: 'var(--ink-1)', outline: 'none', cursor: 'pointer',
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '40px 28px 64px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 13, marginBottom: 12 }}>
          <Link to="/" style={{ color: 'var(--gold-deep)', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: 'var(--ink-4)' }}>/</span>
          <span style={{ color: 'var(--ink-2)', fontWeight: 600 }}>Produtos</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 38, color: 'var(--ink-1)', margin: '0 0 28px' }}>Catálogo</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '248px 1fr', gap: 28, alignItems: 'start' }}>
          {/* Sidebar */}
          <aside style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', padding: 22, position: 'sticky', top: 88 }}>
            {/* Busca */}
            <form onSubmit={handleSearch} style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: 'var(--ink-1)', marginBottom: 10 }}>Buscar</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-4)', display: 'flex' }}><Search size={15} /></span>
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Nome do produto…"
                    style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: 14, padding: '8px 10px 8px 32px', borderRadius: 'var(--r-input)', border: '1px solid var(--line-strong)', outline: 'none' }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--line-strong)'}
                  />
                </div>
                <button type="submit" style={{ background: 'var(--gold)', border: 'none', color: '#fff', padding: '8px 10px', borderRadius: 'var(--r-btn)', cursor: 'pointer', display: 'flex' }}>
                  <Search size={15} />
                </button>
              </div>
            </form>

            <div style={{ height: 1, background: 'var(--line)', margin: '0 0 18px' }} />

            {/* Categorias */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: 'var(--ink-1)', marginBottom: 10 }}>Categorias</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FilterRow active={selectedCategory === null} label="Todas" onClick={() => handleCategoryFilter(null)} />
                {categories.map((cat) => (
                  <FilterRow key={cat.id} active={selectedCategory === cat.id} label={cat.name} onClick={() => handleCategoryFilter(cat.id)} />
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--line)', margin: '0 0 18px' }} />

            {/* Preço */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: 'var(--ink-1)', marginBottom: 10 }}>Preço máximo</div>
              <input type="range" min="0" max="10000" step="100" value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--gold)' }}
              />
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--gold-deep)', marginTop: 4 }}>
                Até R$ {priceRange.max.toLocaleString('pt-BR')}
              </div>
              <button onClick={handlePriceFilter}
                style={{ marginTop: 10, width: '100%', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, background: 'var(--charcoal)', color: '#fff', border: 'none', padding: '9px', borderRadius: 'var(--r-btn)', cursor: 'pointer' }}
              >Aplicar Filtro</button>
            </div>

            <div style={{ height: 1, background: 'var(--line)', margin: '0 0 18px' }} />

            {/* Estoque */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={inStockOnly} onChange={handleStockFilter}
                style={{ width: 16, height: 16, accentColor: 'var(--gold)', cursor: 'pointer' }}
              />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--ink-2)' }}>Apenas em Estoque</span>
            </label>
          </aside>

          {/* Main */}
          <div>
            {/* Sort bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-3)' }}>
                <b style={{ color: 'var(--ink-1)' }}>{products.length}</b> produtos
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <select value={sortBy} onChange={(e) => handleSort(e.target.value, sortOrder)} style={selectStyle}>
                  <option value="created_at">Mais Recentes</option>
                  <option value="price">Preço</option>
                  <option value="name">Nome</option>
                </select>
                <select value={sortOrder} onChange={(e) => handleSort(sortBy, e.target.value)} style={selectStyle}>
                  <option value="desc">Decrescente</option>
                  <option value="asc">Crescente</option>
                </select>
              </div>
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
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, marginBottom: 32 }}>
                  {products.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                  <button onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0}
                    style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, padding: '9px 16px', borderRadius: 'var(--r-btn)', border: '1px solid var(--line-strong)', background: '#fff', color: 'var(--ink-2)', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', opacity: currentPage === 0 ? 0.4 : 1 }}
                  >← Anterior</button>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, padding: '9px 16px', background: 'var(--gold)', color: '#fff', borderRadius: 'var(--r-btn)' }}>
                    {currentPage + 1}
                  </span>
                  <button onClick={() => setCurrentPage(currentPage + 1)} disabled={products.length < pageSize}
                    style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, padding: '9px 16px', borderRadius: 'var(--r-btn)', border: '1px solid var(--line-strong)', background: '#fff', color: 'var(--ink-2)', cursor: products.length < pageSize ? 'not-allowed' : 'pointer', opacity: products.length < pageSize ? 0.4 : 1 }}
                  >Próxima →</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
