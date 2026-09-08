# Sistema de diseño — Horizonte

## Tokens

```css
--ink: #161A1D;
--ink-soft: #4C565D;
--paper: #FFFFFF;
--surface: #F2F4F5;
--line: #C8D0D4;
--accent: #2F9E44;
--accent-ink: #145523;
--support: #1971C2;
--construction: #D9480F;
--warn: #F08C00;
--danger: #C92A2A;
--font-display: "Source Serif 4", Georgia, serif;
--font-body: "Source Sans 3", Arial, sans-serif;
--font-mono: "Source Code Pro", Consolas, monospace;
--fs-display: clamp(2rem, 4vw, 4rem);
--fs-h1: clamp(1.75rem, 3vw, 3rem);
--fs-h2: clamp(1.25rem, 2vw, 1.75rem);
--fs-h3: 1rem;
--fs-body: 1rem;
--fs-ui: 0.875rem;
--fs-label: 0.75rem;
--fs-caption: 0.8125rem;
--sp-1: 0.25rem;
--sp-2: 0.5rem;
--sp-3: 0.75rem;
--sp-4: 1rem;
--sp-5: 1.5rem;
--sp-6: 2rem;
--sp-7: 3rem;
--sp-8: 4rem;
--border: 1px;
--border-strong: 2px;
--radius: 0;
--shadow: none;
--dur-fast: 120ms;
--dur: 180ms;
--ease: cubic-bezier(.2,.8,.2,1);
```

## Component language

- **Bands:** primary layout primitive. White content bands alternate with steel-grey separators.
- **Image selectors:** housing paths are comparable visual cards with a local illustration, readable text, selected border, check mark and `alt` text.
- **Inline detail:** the selected path/decision exposes its explanation and three derived facts immediately below the selector; no modal or deep route is required.
- **Action selectors:** up to three next moves use compact image cards with green/orange/blue semantic accents.
- **Scene frame:** one purposeful frame; SVG layers and labels remain selectable.
- **Timeline rail:** horizontally scrollable on small screens, with direct labels and a text detail for the selected period.
- **Insight strip:** a single yellow-accent explanation with rule ID and a “ver por qué” disclosure.
- **Origin label:** `SEEDED_REFERENCE` and `MOCK` appear close to values; `REAL` has a source link when future adapters exist.

## Responsive behavior

- 360–430 px: scene first, HUD scrollable, housing images in a two-column touch grid, inline detail below, actions stacked and timeline contained in its own horizontal rail.
- 768 px: visual selector in a two-column grid and actions in a two-column grid; no permanent sidebar.
- 1280 px: scene at full width, four housing images in one row, inline detail directly below and timeline/insight after the gameplay block.
- 1600 px: cap content measure; preserve whitespace without enlarging metrics or illustrations excessively.

## Accessibility

- Native buttons and inputs, visible `:focus-visible`, minimum 44 px coarse-pointer targets.
- SVG has title/description and a textual caption.
- Selected state uses border + label + check mark + color, not color alone.
- Timeline nodes have button labels and a non-drag click path.
- Images use descriptive `alt` text; text is never baked into selector artwork.
- Motion is limited to color/border/transform and disabled under `prefers-reduced-motion`.
- Charts are not used for the primary evidence in Phase 1; quantitative comparison uses labeled bars and text.

## Anti-patrones intencionalmente evitados

No gradients morado-azul, no glassmorphism, no bento grid, no radios grandes, no sidebar extensa, no wall of KPIs, no metrics sin fuente, no texto esencial dentro de raster, no 3D pesado en el primer render. Las tarjetas se reservan para las cuatro situaciones comparables y las decisiones activas; no se usan como relleno.
