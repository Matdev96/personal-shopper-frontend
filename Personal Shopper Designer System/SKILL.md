---
name: personal-shopper-design
description: Use this skill to generate well-branded interfaces and assets for Personal Shopper (an online personal-shopping service + integrated e-commerce, pt-BR), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

Start with `colors_and_type.css` for the design tokens (gold / rose-beige / charcoal palette, Playfair Display + Inter type scale, radii, shadows, status colors). The `preview/` folder holds visual specimens of every foundation and component. The `ui_kits/storefront/` and `ui_kits/admin/` folders are high-fidelity, click-through recreations — copy components out of them.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

Key reminders for this brand:
- **Accessible luxury** — warm, clean, elegant. Inspired by Farfetch / NET-A-PORTER but more approachable.
- **Gold is a jewel, not a flood** — roughly one gold element per view (CTAs, price emphasis, active states, badges).
- **Type pairing** — Playfair Display (serif) for the thing being sold/named and for prices; Inter for everything functional.
- **Language is pt-BR**, second person ("você"), warm and reassuring. Match the voice rules in README → Content Fundamentals.
- **Icons: Lucide** (line, 2px stroke) via CDN — never emoji in customer-facing surfaces.
- Cards 10px radius + hairline warm border + soft shadow; buttons 6px; status badges 999px pills.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
