# Unwind Code Website — Agent Instructions

## Repository
`~/unwind-brain/unwind-website/unwindcode-website/`

## Deployment
- **Platform:** Vercel (connected to GitHub)
- **Domain:** unwindcode.ai
- **Auto-deploy:** Push to `main` → Vercel builds and deploys automatically
- **Build:** `npx vite build` (multi-page via `vite.config.js`)

## Site Architecture

```
index.html                          ← Homepage (single-page scroll)
transmissions/index.html            ← Blog listing (all posts)
transmissions/01-*.html             ← Individual post pages
transmissions/15-*.html             ← Latest: interactive flagship
style.css                           ← Global design system
main.js                             ← Homepage interactivity
vite.config.js                      ← Auto-discovers transmissions/*.html
vercel.json                         ← Clean URL routing
```

## Design System Tokens (style.css)

```css
--bg-void: #06060c;
--bg-surface: rgba(15, 15, 30, 0.6);
--bg-surface-solid: #0f0f1e;
--accent: #6e2dbe;
--accent-light: #9b59f5;
--accent-hot: #c084fc;
--accent-border: rgba(110, 45, 190, 0.12);
--text-primary: #f0eef6;
--text-secondary: rgba(240, 238, 246, 0.7);
--text-muted: rgba(240, 238, 246, 0.35);
--font: 'Inter', -apple-system, sans-serif;
```

## CRITICAL: Transmission Format Spec

**Every new transmission MUST be interactive.** Static text walls are rejected.

### Required Interactive Elements (minimum 3 per post)

| Element | Technology | Use When |
|:---|:---|:---|
| **Animated Workflow** | CSS timeline with colored step dots | Explaining processes, sequences, build phases |
| **Clickable Module Explorer** | JS grid + detail panel | Showing system components, agent roles, architecture |
| **Chart.js Visualizations** | `<canvas>` + Chart.js CDN | Metrics, comparisons, evolution over time |
| **Expandable Cards** | Click-to-reveal with hidden detail | Memory layers, feature breakdowns, glossaries |
| **Interactive Diagrams** | CSS grid with hover/click states | Network topologies, data flows, hierarchies |

### Chart.js CDN (include in `<head>`)
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

### Reference Implementation
Use `transmissions/15-how-we-give-machines-a-mind.html` as the canonical template. It contains all five interactive patterns.

### Page Structure (mandatory)

```html
<body class="tx-page">
  <nav id="nav" class="scrolled">...</nav>
  <main>
    <section class="tx-hero">           <!-- Hero with transmission number -->
    <div class="container">
      <section class="tx-section">      <!-- Repeat per content section -->
        <div class="tx-section-head">   <!-- Number + Title -->
        <div class="tx-section-label">  <!-- Subtitle -->
        <div class="tx-prose">          <!-- Body text -->
        <!-- INTERACTIVE ELEMENT -->    <!-- Required per section -->
      </section>
      <div class="tx-cta">             <!-- Closing CTA -->
    </div>
  </main>
  <footer id="footer">...</footer>
</body>
```

### CSS Classes (self-contained in `<style>` tag per transmission)

All interactive transmissions embed their CSS in a `<style>` tag in `<head>`. They import `/style.css` for global tokens and nav/footer chrome, then define page-specific interactive styles inline.

### Dark Theme Only

Transmissions use the site's dark void aesthetic. No light-mode `transmission-body` class. Use `tx-page` class on `<body>`.

### Color Palette for Charts

```javascript
const chartColors = {
  accent: 'rgba(155,89,245,1)',        // --accent-light
  accentFill: 'rgba(155,89,245,0.15)',
  hot: 'rgba(192,132,252,1)',          // --accent-hot
  teal: 'rgba(13,148,136,0.7)',
  grid: 'rgba(240,238,246,0.08)',
  text: 'rgba(240,238,246,0.35)'       // --text-muted
};
```

## Adding a New Transmission

1. Create `transmissions/NN-your-slug.html` using Transmission 15 as template
2. Include at least 3 interactive elements from the table above
3. Update `transmissions/index.html` — add new card at top of archive grid, update featured card
4. Update `index.html` — swap first blog card to the new post
5. Run `npm run build` to verify (Vite auto-discovers new HTML files)
6. `git add -A && git commit && git push origin main`
7. Vercel deploys automatically

## SEO Checklist (per transmission)

- [ ] `<title>` with transmission number and `| Unwind Code`
- [ ] `<meta name="description">` — compelling 1-liner
- [ ] `<link rel="canonical">` — full URL
- [ ] Open Graph: `og:type`, `og:title`, `og:description`
- [ ] JSON-LD `Article` schema with author, publisher, dates

## Voice & Tone

- **Architectural, sharp, minimal.** Zero filler language.
- Write like an engineer explaining to a peer, not marketing copy.
- Use the organism metaphor consistently (cells, cortex, memory, synaptic).
- Every section earns its existence with either insight or interactivity.
