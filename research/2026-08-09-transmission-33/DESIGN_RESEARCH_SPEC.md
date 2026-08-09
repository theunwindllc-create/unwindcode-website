# Design Research Specification — Transmission 33

## Direction

Continue Transmission 32's dark, technical, self-contained visual language while giving Transmission 33 its own “hands/receipts” grammar.

## Palette

- Base: existing `--bg-void`, `--text-primary`, `--text-secondary`.
- Identity: violet/iris.
- Runtime hands: cyan/teal.
- Human gates: amber/gold.
- Failures: restrained rose.
- Verified receipts: muted green.

## Typography

- Inter for prose and headings.
- JetBrains Mono for charters, session receipts, dates, state labels, and logs.
- Keep headings compact and architectural.

## Layout

- Dark full-height hero with split thesis/console.
- Maximum prose width near 760px.
- Modular panels with one-pixel borders and low-opacity surfaces.
- Section numbers remain visible and stable.

## Interaction Components

1. **Charter audit console:** 14 original charters, state filters, verified counts.
2. **Identity explorer:** buttons for operator, public persona, pre-public boundary, child session, tool playbook.
3. **WAIT LAW timeline:** parent end, 16-second gap, child finish, three announce retries, failure verdict.
4. **Threat model cards:** native `details` for keyboard and no-script legibility.
5. **Proof tabs:** dated artifacts and bounded claim notes.

## Motion

- Short opacity/transform transitions only.
- Timeline reveal should explain sequencing, not decorate.
- All motion must stop under `prefers-reduced-motion: reduce`.
- No scroll hijack, WebGL, canvas dependency, or CDN dependency is required.

## Accessibility

- Native buttons/details with visible focus.
- `aria-pressed`, `aria-expanded`, and live verdict text where state changes.
- No meaning carried by color alone.
- Responsive single-column layouts below 900px.
- Interactions should degrade to complete static content.

## Assets

No new bitmap, carousel, or registered social asset is applicable. Use code-native HTML/CSS diagrams only.

