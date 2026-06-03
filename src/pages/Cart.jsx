import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShoppingBag, Minus, Plus, Trash2, Check } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

export default function Cart() {
  const navigate = useNavigate();
  const { items, fetchCartItems, updateItem, removeItem, clearCart, totalPrice, isLoading } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchCartItems();
  }, [user]);

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty <= 0) { await handleRemove(itemId); return; }
    try { await updateItem(itemId, newQty); } catch (error) { toast.error(error.detail || 'Erro ao atualizar quantidade'); }
  };

  const handleRemove = async (itemId) => {
    try { await removeItem(itemId); toast.success('Item removido!'); } catch (error) { toast.error(error.detail || 'Erro ao remover'); }
  };

  const handleClear = async () => {
    if (!window.confirm('Limpar o carrinho?')) return;
    try { await clearCart(); toast.success('Carrinho limpo!'); } catch (error) { toast.error(error.detail || 'Erro ao limpar'); }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="ps-spin" style={{ width: 40, height: 40, borderRadius: 999, border: '3px solid var(--gold-tint)', borderTopColor: 'var(--gold)' }} />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '40px 28px 64px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 13, marginBottom: 12 }}>
          <Link to="/" style={{ color: 'var(--gold-deep)', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: 'var(--ink-4)' }}>/</span>
          <span style={{ color: 'var(--ink-2)', fontWeight: 600 }}>Carrinho</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 38, color: 'var(--ink-1)', margin: '0 0 28px' }}>Seu Carrinho</h1>

        {items.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ color: 'var(--rose-deep)', marginBottom: 18, display: 'flex', justifyContent: 'center' }}>
              <ShoppingBag size={64} strokeWidth={1.3} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26, color: 'var(--ink-1)', margin: '0 0 10px' }}>Seu carrinho está vazio</h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-3)', margin: '0 0 24px' }}>Adicione alguns produtos para começar suas compras!</p>
            <Link
              to="/products"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, background: 'var(--gold)', color: '#fff', textDecoration: 'none', padding: '12px 26px', borderRadius: 'var(--r-btn)', display: 'inline-block' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-strong)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--gold)'}
            >Explorar Produtos</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
            {/* Items list */}
            <div>
              <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
                {items.map((item, idx) => (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto auto', gap: 16, alignItems: 'center', padding: 18, borderTop: idx ? '1px solid var(--line)' : 'none' }}>
                    <div style={{ borderRadius: 8, overflow: 'hidden', background: 'linear-gradient(135deg, var(--rose-soft), var(--rose))', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.product?.image_url ? (
                        <img src={item.product.image_url} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <ShoppingBag size={24} strokeWidth={1.3} style={{ color: 'var(--rose-deep)' }} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--ink-1)', marginBottom: 2 }}>{item.product?.name || 'Produto'}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-3)' }}>R$ {item.price_at_time.toFixed(2).replace('.', ',')} por unidade</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-strong)', borderRadius: 6, overflow: 'hidden' }}>
                      <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        style={{ width: 36, height: 38, background: 'var(--surface-2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-1)' }}>
                        <Minus size={14} />
                      </button>
                      <span style={{ width: 36, textAlign: 'center', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        style={{ width: 36, height: 38, background: 'var(--surface-2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-1)' }}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 110 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--ink-1)' }}>
                        R$ {(item.price_at_time * item.quantity).toFixed(2).replace('.', ',')}
                      </div>
                      <button onClick={() => handleRemove(item.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--err-fg)', fontSize: 12, fontFamily: 'var(--font-body)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                        <Trash2 size={12} />Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleClear}
                style={{ marginTop: 12, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--err-fg)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Trash2 size={14} />Limpar carrinho
              </button>
            </div>

            {/* Summary */}
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', padding: 24, position: 'sticky', top: 88, boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: 'var(--ink-1)', margin: '0 0 20px' }}>Resumo do Pedido</h2>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-2)' }}>
                <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                <span style={{ fontWeight: 600, color: 'var(--ink-1)' }}>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-2)' }}>
                <span>Frete</span>
                <span style={{ fontWeight: 600, color: 'var(--ok-fg)' }}>Grátis</span>
              </div>
              <div style={{ height: 1, background: 'var(--line)', margin: '14px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 17, color: 'var(--ink-1)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: 'var(--gold-deep)' }}>
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                style={{ width: '100%', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, background: 'var(--gold)', color: '#fff', border: 'none', padding: '13px', borderRadius: 'var(--r-btn)', cursor: 'pointer', transition: 'background var(--dur) var(--ease)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-strong)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--gold)'}
              >Ir para Checkout</button>

              <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 9 }}>
                {['Frete grátis acima de R$ 100', 'Parcelamento em até 12x sem juros', 'Garantia de satisfação'].map((t) => (
                  <div key={t} style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-3)' }}>
                    <Check size={14} style={{ color: 'var(--gold-deep)', flexShrink: 0 }} />{t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
