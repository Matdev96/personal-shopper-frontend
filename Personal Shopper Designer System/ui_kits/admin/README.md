# Admin UI Kit — Personal Shopper

The admin panel (painel administrativo), re-skinned to the accessible-luxury brand. Charcoal sidebar, warm content surface, Lucide line icons replacing the source app's emoji. Click-through prototype, not production code.

## Run
Open `index.html` (React 18 + Babel in-browser; tokens at `../../colors_and_type.css`; Lucide via CDN). "Voltar para Loja" links to the storefront kit.

## Screens
- **Dashboard** — two stat-card rows (e-commerce + solicitações), quick actions, recent-requests table. Click a row to open its detail.
- **Usuários** — user table with role pills.
- **Produtos** — product table with thumbnail, price, stock, active toggle, row actions, search + "Novo Produto".
- **Solicitações** — filterable request table (Todas / Pendentes / Em Busca / Entregues).
- **Detalhe da Solicitação** — request summary, **status timeline** over the full lifecycle, and an admin action rail (advance status, quote price, deposit/final payment tracking).

## Status system
`components.jsx` exports `STATUS` (15 lifecycle states → labels), `TONE` (→ token colors), and `<StatusBadge>`. `LIFECYCLE` is the ordered array driving the timeline. Mirrors the source `requestStatus.js`, re-tuned to the warm palette (yellow=pendente, blue=em busca, green=entregue, red=cancelado).

## Files
| File | Contents |
|---|---|
| `index.html` | Shell — React/Babel, fonts, Lucide; mounts after fonts load. |
| `components.jsx` | `Icon`, `AdminButton`, `StatusBadge`, `StatCard`, `STATUS`/`TONE`/`LIFECYCLE`, mock data. |
| `chrome.jsx` | `Sidebar` (collapsible charcoal nav), `Topbar`. |
| `screens.jsx` | `Dashboard`, `Products`, `Users`, `Requests`, `RequestDetail` (+ timeline). |
| `app.jsx` | Route state; mounts the app. |

## Notes
- Desktop-first (designed ~1280px+). Tables scroll horizontally inside their panels on narrow viewports.
- Cosmetic recreation — no real data layer; numbers and rows are mock fixtures.
