# Storefront UI Kit — Personal Shopper

Customer-facing surface of Personal Shopper, re-skinned to the **accessible-luxury** brand (gold / rose / charcoal · Playfair + Inter). A click-through prototype, not production code.

## Run
Open `index.html`. It loads React 18 + Babel (in-browser) and the shared tokens at `../../colors_and_type.css`. Lucide icons via CDN.

## Screens (click-through)
- **Home** — rose hero, search, category tiles, featured product grid, charcoal CTA banner for personal-shopping requests.
- **Catálogo** — sidebar filters (categoria + preço slider) and a responsive product grid.
- **Produto** — image, specs, quantity stepper, add-to-cart (serif title & price).
- **Carrinho** — line items with quantity steppers, sticky order summary, trust microcopy. Empty state included.
- **Login** — split layout: charcoal brand panel + white form card with password toggle.

Stub screens (Pedidos, Solicitações, Checkout, Perfil) render a tasteful placeholder — the admin kit covers request management.

## Interactions that work
- Login / logout (header swaps to show Pedidos, Solicitações, cart badge, user dropdown).
- Add to cart (requires login — fires an error toast + redirect otherwise), quantity update, remove, live totals.
- Toasts (success/error), gold loading affordances, hover lifts on cards.

## Files
| File | Contents |
|---|---|
| `index.html` | Shell — loads React/Babel, fonts, Lucide; mounts after fonts load. |
| `components.jsx` | `Icon`, `Button`, `Badge`, `Field`, `ProductImage`, `ProductCard` + mock data (`PRODUCTS`, `CATEGORIES`, `BRL`). |
| `chrome.jsx` | `Header` (sticky, cart badge, user menu), `Footer` (dark, social SVGs). |
| `screens.jsx` | `Home`, `Catalog`, `ProductDetail`, `Cart`, `Login` + `SectionHeader`, `Breadcrumb`. |
| `app.jsx` | Route/cart/auth/toast state; mounts the app. |

## Notes
- Product imagery uses on-brand placeholder tiles (Lucide glyph on rose gradient). Drop in real product photos by swapping `ProductImage`.
- Components are intentionally cosmetic recreations — they mirror the source app's IA and pt-BR copy, not its data layer.
