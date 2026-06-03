export default function Loading() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(52,50,51,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', borderRadius: 'var(--r-card)', padding: '36px 44px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-lg)' }}>
        <div className="ps-spin" style={{ width: 40, height: 40, borderRadius: 999, border: '3px solid var(--gold-tint)', borderTopColor: 'var(--gold)' }} />
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: 'var(--ink-2)', margin: 0 }}>Carregando...</p>
      </div>
    </div>
  );
}
