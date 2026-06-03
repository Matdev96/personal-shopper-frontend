import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShoppingBag, ChevronDown, Menu } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso!');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: isActive(to) ? 600 : 500,
        color: isActive(to) ? 'var(--gold-deep)' : 'var(--ink-2)',
        textDecoration: 'none',
        transition: 'color var(--dur) var(--ease)',
        padding: '4px 0',
        borderBottom: isActive(to) ? '2px solid var(--gold)' : '2px solid transparent',
      }}
      onMouseEnter={(e) => { if (!isActive(to)) e.currentTarget.style.color = 'var(--ink-1)'; }}
      onMouseLeave={(e) => { if (!isActive(to)) e.currentTarget.style.color = 'var(--ink-2)'; }}
    >
      {children}
    </Link>
  );

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        maxWidth: 'var(--container-wide)', margin: '0 auto',
        padding: '0 28px', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 9,
            background: 'var(--charcoal)', color: 'var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17,
          }}>PS</div>
          <span className="hidden md:inline" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--ink-1)' }}>
            Personal Shopper
          </span>
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden md:flex" style={{ alignItems: 'center', gap: 28 }}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Produtos</NavLink>
          {isAuthenticated && <NavLink to="/orders">Pedidos</NavLink>}
          {isAuthenticated && <NavLink to="/requests">Solicitações</NavLink>}
          {user?.is_admin && <NavLink to="/admin/dashboard">Dashboard</NavLink>}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative', color: 'var(--ink-1)', display: 'flex', textDecoration: 'none' }}>
            <ShoppingBag size={22} strokeWidth={1.8} />
            {items.length > 0 && (
              <span style={{
                position: 'absolute', top: -7, right: -8,
                background: 'var(--gold)', color: '#fff',
                fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-body)',
                width: 17, height: 17, borderRadius: 999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{items.length}</span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-1)' }}
              >
                <span style={{
                  width: 32, height: 32, borderRadius: 999,
                  background: 'var(--gold-tint)', color: 'var(--gold-deep)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
                }}>
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
                <span className="hidden md:inline" style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500 }}>
                  {user?.full_name?.split(' ')[0] || 'Usuário'}
                </span>
                <ChevronDown size={14} style={{ color: 'var(--ink-3)' }} />
              </button>

              {menuOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setMenuOpen(false)} />
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                    width: 200, background: '#fff',
                    borderRadius: 10, boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--line)', overflow: 'hidden',
                    padding: '6px 0', zIndex: 50,
                  }}>
                    {[
                      ['/profile', 'Meu Perfil'],
                      ['/orders', 'Meus Pedidos'],
                      ['/requests', 'Minhas Solicitações'],
                    ].map(([path, label]) => (
                      <Link
                        key={path} to={path}
                        onClick={() => setMenuOpen(false)}
                        style={{ display: 'block', padding: '10px 16px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-2)', textDecoration: 'none' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                      >{label}</Link>
                    ))}
                    {user?.is_admin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setMenuOpen(false)}
                        style={{ display: 'block', padding: '10px 16px', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--gold-deep)', textDecoration: 'none', borderTop: '1px solid var(--line)' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-wash)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                      >Dashboard Admin</Link>
                    )}
                    <button
                      onClick={handleLogout}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', borderTop: '1px solid var(--line)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--err-fg)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--err-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >Sair</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link to="/login" style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--ink-2)', textDecoration: 'none' }}>
                Entrar
              </Link>
              <Link
                to="/register"
                style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, background: 'var(--gold)', color: '#fff', textDecoration: 'none', padding: '9px 18px', borderRadius: 'var(--r-btn)', transition: 'background var(--dur) var(--ease)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold-strong)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--gold)'}
              >Cadastrar</Link>
            </div>
          )}

          {/* Mobile burger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-1)', display: 'flex' }}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="md:hidden" style={{ background: '#fff', borderTop: '1px solid var(--line)', padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            ['/', 'Home'],
            ['/products', 'Produtos'],
            ...(isAuthenticated ? [['/orders', 'Pedidos'], ['/requests', 'Solicitações']] : []),
            ...(user?.is_admin ? [['/admin/dashboard', 'Dashboard Admin']] : []),
          ].map(([path, label]) => (
            <Link key={path} to={path} onClick={() => setMobileOpen(false)} style={{ padding: '11px 4px', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, color: isActive(path) ? 'var(--gold-deep)' : 'var(--ink-1)', textDecoration: 'none', borderBottom: '1px solid var(--line)' }}>
              {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button onClick={handleLogout} style={{ textAlign: 'left', padding: '11px 4px', marginTop: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--err-fg)' }}>Sair</button>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} style={{ padding: '11px 4px', fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--gold-deep)', textDecoration: 'none', fontWeight: 600 }}>Entrar</Link>
          )}
        </div>
      )}
    </header>
  );
}
