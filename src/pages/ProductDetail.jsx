import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import useProductStore from '../store/productStore';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

function Spec({ label, value, tone }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-3)', marginBottom: 3 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: tone === 'err' ? 'var(--err-fg)' : tone === 'ok' ? 'var(--ok-fg)' : 'var(--ink-1)' }}>{value}</div>
    </div>
  );
}

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currentProduct, fetchProductById, isLoading } = useProductStore();
  const { addItem, isLoading: cartLoading } = useCartStore();
  const { user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => { fetchProductById(parseInt(productId)); }, [productId]);

  const handleAddToCart = async () => {
    if (!user) { toast.warning('Faça login para adicionar ao carrinho'); navigate('/login'); return; }
    if (!currentProduct || quantity > currentProduct.stock) { toast.error('Quantidade indisponível em estoque'); return; }
    try {
      await addItem(currentProduct.id, quantity);
      toast.success(`${currentProduct.name} adicionado ao carrinho!`);
      setQuantity(1);
    } catch (error) { toast.error(error.detail || 'Erro ao adicionar ao carrinho'); }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="ps-spin" style={{ width: 40, height: 40, borderRadius: 999, border: '3px solid var(--gold-tint)', borderTopColor: 'var(--gold)' }} />
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--ink-1)', margin: 0 }}>Produto não encontrado</h2>
        <Link to="/" style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: 'var(--gold-deep)', textDecoration: 'none' }}>Voltar para Home</Link>
      </div>
    );
  }

  const out = currentProduct.stock === 0;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '40px 28px 64px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 13, marginBottom: 16 }}>
          <Link to="/" style={{ color: 'var(--gold-deep)', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: 'var(--ink-4)' }}>/</span>
          <Link to="/products" style={{ color: 'var(--gold-deep)', textDecoration: 'none' }}>Produtos</Link>
          <span style={{ color: 'var(--ink-4)' }}>/</span>
          <span style={{ color: 'var(--ink-2)', fontWeight: 600 }}>{currentProduct.name}</span>
        </div>

        {/* Main card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', padding: 32, boxShadow: 'var(--shadow-sm)' }}>
          {/* Image */}
          <div style={{ borderRadius: 10, overflow: 'hidden', background: 'linear-gradient(135deg, var(--rose-soft), var(--rose))', minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {currentProduct.image_url ? (
              <img src={currentProduct.image_url} alt={currentProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <ShoppingBag size={80} strokeWidth={1.2} style={{ color: 'var(--rose-deep)' }} />
            )}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {currentProduct.category?.name && (
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--gold-deep)', marginBottom: 10 }}>
                {currentProduct.category.name}
              </div>
            )}
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, lineHeight: 1.22, color: 'var(--ink-1)', margin: '0 0 16px' }}>
              {currentProduct.name}
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.6, color: 'var(--ink-2)', margin: '0 0 22px', flex: 1 }}>
              {currentProduct.description}
            </p>

            {/* Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, background: 'var(--surface-2)', borderRadius: 10, padding: 18, marginBottom: 24 }}>
              {currentProduct.color && <Spec label="Cor" value={currentProduct.color} />}
              {currentProduct.size && <Spec label="Tamanho" value={currentProduct.size} />}
              <Spec label="Estoque" value={out ? 'Fora de estoque' : `${currentProduct.stock} unidades`} tone={out ? 'err' : 'ok'} />
              <Spec label="Entrega" value="5–9 dias úteis" />
            </div>

            {/* Price & Actions */}
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 22 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-3)', marginBottom: 4 }}>Preço</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, color: 'var(--ink-1)', marginBottom: 20 }}>
                R$ {currentProduct.price.toFixed(2).replace('.', ',')}
              </div>

              {!out && (
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-strong)', borderRadius: 'var(--r-btn)', overflow: 'hidden' }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{ width: 40, height: 44, background: 'var(--surface-2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-1)' }}>
                      <Minus size={16} />
                    </button>
                    <span style={{ width: 48, textAlign: 'center', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15 }}>{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                      style={{ width: 40, height: 44, background: 'var(--surface-2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-1)' }}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-3)' }}>
                    Máximo: {currentProduct.stock} un.
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || out}
                  style={{ width: '100%', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, background: out || cartLoading ? 'var(--ink-4)' : 'var(--gold)', color: '#fff', border: 'none', padding: '13px', borderRadius: 'var(--r-btn)', cursor: out || cartLoading ? 'not-allowed' : 'pointer', transition: 'background var(--dur) var(--ease)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onMouseEnter={(e) => { if (!out && !cartLoading) e.currentTarget.style.background = 'var(--gold-strong)'; }}
                  onMouseLeave={(e) => { if (!out && !cartLoading) e.currentTarget.style.background = 'var(--gold)'; }}
                >
                  <ShoppingBag size={17} />
                  {cartLoading ? 'Adicionando...' : out ? 'Indisponível' : 'Adicionar ao Carrinho'}
                </button>
                <Link to="/products"
                  style={{ width: '100%', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, background: '#fff', color: 'var(--ink-2)', border: '1px solid var(--line-strong)', padding: '11px', borderRadius: 'var(--r-btn)', textDecoration: 'none', textAlign: 'center', transition: 'all var(--dur) var(--ease)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ink-3)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-strong)'; }}
                >Continuar Comprando</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
