import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, clearErrors } = useForm();
  const { login, isLoading } = useAuthStore();
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusField, setFocusField] = useState(null);

  const handleFieldChange = () => { if (loginError) setLoginError(''); };

  const onSubmit = async (data) => {
    setLoginError('');
    try {
      await login(data.email, data.password);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      setLoginError(error?.detail || 'Email ou senha incorretos');
    }
  };

  const fieldStyle = (name, hasError) => ({
    width: '100%',
    fontFamily: 'var(--font-body)', fontSize: 15,
    padding: '11px 12px',
    paddingRight: name === 'password' ? 40 : 12,
    borderRadius: 'var(--r-input)',
    background: '#fff', color: 'var(--ink-1)',
    outline: 'none',
    border: `1px solid ${hasError ? 'var(--err-border)' : focusField === name ? 'var(--gold)' : 'var(--line-strong)'}`,
    boxShadow: hasError ? '0 0 0 3px rgba(162,58,47,.10)' : focusField === name ? '0 0 0 3px rgba(219,169,56,.18)' : 'none',
    transition: 'all var(--dur) var(--ease)',
  });

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left — brand panel */}
      <div style={{ background: 'linear-gradient(150deg, #2c2a2b, #3a3637)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', padding: '64px 56px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 40, height: 40, borderRadius: 9, background: 'var(--gold)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>PS</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: '#fff' }}>Personal Shopper</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>Bem-vindo de volta</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 36, lineHeight: 1.15, color: '#fff', margin: 0, maxWidth: 380 }}>Os melhores importados, escolhidos a dedo.</h2>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,.5)', margin: 0 }}>Entre para acompanhar pedidos e solicitações de busca.</p>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 400, background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', padding: 36, boxShadow: 'var(--shadow-md)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, color: 'var(--ink-1)', margin: '0 0 6px', textAlign: 'center' }}>Entrar</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-3)', textAlign: 'center', margin: '0 0 24px' }}>Acesse sua conta</p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email é obrigatório', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email inválido' }, onChange: handleFieldChange })}
                style={fieldStyle('email', !!(loginError || errors.email))}
                placeholder="seu@email.com"
                onFocus={() => setFocusField('email')}
                onBlur={() => setFocusField(null)}
              />
              {errors.email && <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--err-fg)', marginTop: 4 }}>{errors.email.message}</p>}
            </div>

            {/* Senha */}
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 6 }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Senha é obrigatória', onChange: handleFieldChange })}
                  style={fieldStyle('password', !!(loginError || errors.password))}
                  placeholder="••••••••"
                  onFocus={() => setFocusField('password')}
                  onBlur={() => setFocusField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--err-fg)', marginTop: 4 }}>{errors.password.message}</p>}
              <div style={{ textAlign: 'right', marginTop: 6 }}>
                <Link to="/forgot-password" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gold-deep)', textDecoration: 'none' }}>
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            {/* Erro de credenciais */}
            {loginError && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--err-bg)', border: '1px solid var(--err-border)', borderRadius: 8, padding: '10px 14px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--err-fg)' }}>{loginError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={isLoading}
              style={{ width: '100%', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, background: isLoading ? 'var(--ink-4)' : 'var(--gold)', color: '#fff', border: 'none', padding: '12px', borderRadius: 'var(--r-btn)', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background var(--dur) var(--ease)' }}
              onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = 'var(--gold-strong)'; }}
              onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = 'var(--gold)'; }}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-3)', textAlign: 'center', marginTop: 20 }}>
            Não tem conta?{' '}
            <Link to="/register" style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--gold-deep)', textDecoration: 'none' }}>
              Registre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
