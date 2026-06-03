# Personal Shopper — Design System

A reusable design system for **Personal Shopper**, an online personal-shopping service with an integrated e-commerce store. This system elevates the product's interface into an **"accessible luxury"** brand — warm, clean, and elegant, inspired by Farfetch and NET-A-PORTER but more approachable.

> **Design intent vs. current code.** The source repository currently ships a generic blue Tailwind theme (functional, but unbranded). This design system defines the *target* brand direction provided by the product owner: a **gold / rose-beige / charcoal** palette with Playfair Display + Inter typography. Everything here keeps the source app's information architecture, Portuguese (pt-BR) copy, component inventory, and the 15-state request-status system — only the visual language is re-skinned.

---

## What is Personal Shopper?

Personal Shopper is a TCC (Trabalho de Conclusão de Curso) project for the ADS course. It is **two products in one platform**:

1. **Loja (e-commerce)** — customers browse a catalog, filter by category/price/search, view product detail, add to cart, and check out (delivery by address via ViaCEP lookup, or in-store pickup).
2. **Solicitações de busca (personal shopping)** — customers request a *specific* product the store doesn't stock (with reference, store, budget, size). An admin shops for it through a multi-stage status lifecycle, quotes a price, the customer confirms and pays a 50% deposit + 50% final, and the item is delivered.

There is also a full **painel administrativo** (admin panel): dashboard with stats, product CRUD with image upload, user management, and request management (advance status, quote price, review payments).

**Audience:** Brazilian consumers buying imported (USA) goods. All UI copy is **pt-BR**.

---

## Sources

This system was built by reading the real frontend codebase. If you have access, explore these to build higher-fidelity designs:

- **Frontend (source of truth for IA, copy, components, flows):**
  https://github.com/Matdev96/personal-shopper-frontend
  — React 19 + Vite 5 + Tailwind CSS v4 + Zustand + react-router-dom 7 + react-hook-form + react-toastify.
- **Backend (data model & lifecycle reference):**
  https://github.com/Matdev96/personal-shopper-backend
  — FastAPI + PostgreSQL.

Key files lifted into this project for reference live under `src/` (imported pages & components) and `colors_and_type.css` (tokens). Explore the repos above for deeper component logic.

---

## Content Fundamentals

How Personal Shopper writes. Match this voice in any new copy.

- **Language:** Brazilian Portuguese (pt-BR), always. Currency is `R$ 1.234,56` (the code uses `R$ {price.toFixed(2)}` → `R$ 199.90`; prefer pt-BR decimal comma in polished copy).
- **Address:** Second person, warm and direct — **"você"**, never "tu" or "vós". E.g. *"Seu carrinho está vazio"*, *"Adicione alguns produtos para começar suas compras!"*, *"Você precisa estar logado…"*.
- **Tone:** Friendly, reassuring, lightly aspirational — a concierge, not a discount warehouse. Trust-building microcopy is common: *"✓ Garantia de satisfação ou seu dinheiro de volta"*, *"✓ Frete grátis em compras acima de R$ 100"*, *"✓ Parcelamento em até 12x sem juros"*.
- **Casing:** Sentence case for body and most buttons. **Section headers and nav use Title Case** (*"Resumo do Pedido"*, *"Ações Rápidas"*, *"Solicitações Recentes"*). Short uppercase eyebrows are a *new* luxury affordance this system adds (e.g. `NOVIDADES`, `PERSONAL SHOPPING`) — use sparingly.
- **Buttons:** Imperative verbs — *"Entrar"*, *"Registrar"*, *"Buscar"*, *"Adicionar ao Carrinho"*, *"Ir para Checkout"*, *"Continuar Comprando"*, *"Ver Detalhes"*, *"Gerenciar →"*.
- **Status language:** Human, first-person from the customer's POV — *"Aguardando sua Confirmação"*, *"Sinal Enviado"*, *"Em Busca"*. Never raw enum keys.
- **Feedback (toasts):** Exclamatory and immediate — *"Login realizado com sucesso!"*, *"Quantidade atualizada!"*, *"Item removido do carrinho!"*, *"Erro ao carregar produtos"*.
- **Emoji:** The *source admin* uses emoji as section/stat icons (📊 👥 📦 🛍️ 🛒 💰 🕐 ⚠️). **This design system replaces them with Lucide line icons** to hold the luxury tone — avoid emoji in customer-facing surfaces. See Iconography.
- **Empty / placeholder states:** Honest and gentle — *"Nenhum produto encontrado"*, *"Funcionalidade de produtos relacionados será implementada em breve."*

---

## Visual Foundations

The look: **warm, editorial, generously spaced, gold used as a jewel — never a flood.**

### Color
- **Charcoal `#343233`** carries all primary text, the top navbar, and the footer. It is the "ink" of the brand — soft black, slightly warm.
- **Gold `#dba938`** is the single accent: primary CTAs, price emphasis, active states, badges, focus rings, thin rules. Used **sparingly** — roughly one gold element per view. Hover darkens to `#c2922b`; gold text on light uses `#a87c1f` for contrast.
- **Rose beige `#e5cec4`** fills section bands, hero backdrops, and some card fills. Lighter `#efe1da` / faint `#f7efea` create soft alternating rhythm. It is the warmth that separates this from cold luxury sites.
- **White `#ffffff`** is for cards and forms — crisp islands floating on the rose-washed page.
- Neutrals are **warm-tinted grays** (not pure gray) so nothing reads cold next to the rose/gold.

### Typography
- **Playfair Display** (serif) for headings, hero, product names, and prices — high-contrast, fashion-editorial. Weights 600–700; occasional italic for refined accents.
- **Inter** for all body, labels, buttons, captions (DM Sans is an acceptable substitute). Weights 400–700.
- Pairing rule: serif for *the thing being sold or named*, sans for *everything functional*.
- Eyebrows: 12px Inter 600, uppercase, `letter-spacing: 0.14em`, gold.

### Spacing & layout
- 4px base scale. Content max-width ~1152px, centered, generous side padding.
- Sections breathe: 64–96px vertical rhythm on marketing surfaces; 24–32px inside cards.
- The header is **sticky** (`top: 0`, `z-index: 50`) with a soft bottom shadow. Admin uses a fixed dark **sidebar** (charcoal) that collapses 256px → 80px.

### Surfaces, borders, radii
- **Cards:** white, radius **10px** (range 8–12px), hairline border `#e7e0dc` + soft shadow `0 6px 20px rgba(52,50,51,.09)`; lift to a larger shadow on hover.
- **Buttons:** radius **6px**. **Inputs:** radius **8px**, 1px `#d8cfc9` border. **Status badges:** fully rounded **999px** pills.
- Borders are hairline and warm; dividers use `#e7e0dc`. Avoid heavy or colored left-border-accent cards.

### Shadows / elevation
- Warm-tinted shadows (charcoal alpha, never pure black). Four steps xs→lg, plus a gold glow `0 8px 24px rgba(219,169,56,.28)` reserved for the primary CTA on hover.

### Imagery
- Product photography on neutral/white grounds, warm-leaning, object-cover in fixed-ratio frames (cards ~4:3, detail up to 96px-tall hero). Placeholder state: `#e7e0dc` block reading *"Sem imagem"* — never a broken image.

### Motion & states
- Calm and short: `220ms` with an ease-out curve; fades and small lifts, **no bounces**. Loading is a thin **gold** spinner ring (`border-b-2`, animate-spin).
- **Hover:** links → gold; cards → deeper shadow + image scales `1.05`; primary button → darker gold (`#c2922b`).
- **Press:** subtle scale-down (~0.99) and/or darker fill.
- **Focus:** 2px gold ring (`#dba938`) with slight offset — visible and on-brand for accessibility.
- **Disabled:** `--ink-4` text on muted fill, `cursor: not-allowed`, ~40% opacity for ghost controls.

### Transparency & blur
- Minimal. Reserve subtle backdrop blur for the sticky header over imagery and for toast overlays. No glassmorphism elsewhere.

---

## Iconography

- **The source app uses two icon idioms:** (1) inline **outline SVGs** in a Heroicons/Feather style (`stroke-width: 2`, 24×24, `currentColor`) for cart, user, hamburger, password eye, and social glyphs in the footer; (2) **emoji** as decorative icons in the admin panel (📊 dashboard, 👥 users, 📦 products, 🛍️ requests, 🛒 orders, 💰 revenue, 🕐 pending, ⚠️ urgent).
- **This system standardizes on [Lucide](https://lucide.dev)** (CDN) — a clean, consistent line set with the same 2px stroke weight as the app's existing inline SVGs, so it drops in seamlessly and **replaces the admin emoji** for a more elegant tone. Load via CDN:
  ```html
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
  ```
  Common mappings: `shopping-bag` (cart/brand), `user`, `menu`, `eye`/`eye-off`, `search`, `layout-dashboard`, `users`, `package`, `shopping-cart`, `wallet`, `clock`, `alert-triangle`, `chevron-right`, `check`, `truck`.
- **Icon color:** inherit `currentColor` (charcoal default, gold on accent/active). Keep icons line-only — no filled/duotone — to match the editorial feel.
- **No custom illustrations or logos exist** in the repo. The brand mark is a **typographic monogram "PS"** in a gold/charcoal tile plus the "Personal Shopper" wordmark — rendered in CSS/HTML, not as an image asset. Use the wordmark in Playfair Display.
- *Substitution flagged:* the original used emoji + ad-hoc inline SVGs; Lucide is the closest consistent CDN match. If you want a bespoke icon set or a real logo file, provide it and this system will adopt it.

---

## Index — what's in this folder

| File / folder | What it is |
|---|---|
| `README.md` | This file — product context, content & visual foundations, iconography, manifest. |
| `colors_and_type.css` | All design tokens: color vars, type scale, radii, shadows, spacing, motion + semantic classes (`.ps-h1`, `.ps-body`, `.ps-eyebrow`, …). |
| `SKILL.md` | Agent Skill entry point (for use in Claude Code). |
| `preview/` | Design-system cards (colors, type, components, spacing) shown in the Design System tab. |
| `ui_kits/storefront/` | Customer-facing UI kit — Home, Catálogo, Produto, Carrinho, Login. `index.html` is a click-through prototype. |
| `ui_kits/admin/` | Admin panel UI kit — Dashboard, Produtos, Solicitações + status timeline. `index.html` is a click-through prototype. |
| `src/` | Reference: pages & components imported from the source repo (read-only context). |

**To build with this system:** start from `colors_and_type.css` for tokens, copy components out of the relevant `ui_kits/` folder, and follow the voice + visual rules above. For production work, read the source repos linked under Sources.
