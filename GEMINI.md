# Unwind Code Website — Agent Instructions

## Repository
`~/unwind-brain/unwind-website/unwindcode-website/` (symlink; real location: `~/unwind-brain-external/unwind-website/unwindcode-website/`)

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

## URL Contract (locked 2026-07-14 — do not regress)

Vercel serves **clean URLs** (`vercel.json`: `cleanUrls: true`, `trailingSlash: false`). Every URL the
site publishes about itself MUST use the served form, or Google Search Console fills with
"Page with redirect" errors (this happened; commit `48ee77d` fixed 61 of 62 sitemap URLs being 308s):

- Page routes are **extensionless**: `/transmissions/27-the-quotation-cell`, never `...-cell.html`.
- Directory pages have **no trailing slash**: `/organisms`, `/proof`, `/build-with-us`. Root stays `/`.
- This applies to: `sitemap.xml` + `public/sitemap.xml` `<loc>` entries, `<link rel="canonical">`,
  `og:url`, JSON-LD url fields, internal `<a href>` links, `llms.txt` + `public/llms.txt`,
  `ai-services.json`, and every `route` / `source_route` / `site_routes` value in `public/data/*.json`.
- **Disk-path fields keep `.html`**: `source_file`, `path`, provenance hash entries, and any
  file read/write target. Routes are names; files are files. Never confuse the two.
- The transmission HTML **file** is still created as `transmissions/NN-slug.html` — Vercel serves it
  at the extensionless route automatically.
- Old `.html` URLs 308-redirect to the clean form (fine for inbound links; never emit them yourself).
- Registered asset provenance hashes bind `source_route` + file contents. After changing any
  registered file or route, run `node scripts/recompute-asset-digests.mjs` (refreshes file sha256
  entries, package digests, and approval-record digest references), then `npm test`.
- Local clean-URL verification: `npx serve dist -l 4199` honors cleanUrls; `vite preview` does NOT
  resolve extensionless routes — do not use it to judge routing.
- Two discovery surfaces exist on purpose: root `sitemap.xml`/`llms.txt`/`ai-services.json` are what
  ships (the Vite plugin copies them into `dist`, overwriting the `public/` copies); `public/sitemap.xml`
  + `public/llms.txt` are the reduced public-RAG-seed surface that local parity and tests validate.
  Update BOTH when adding a transmission.

## Adding a New Transmission

1. **Pick the next number** — check `transmissions/` for collisions first (07/08/09 share one slug
   and two different files claim 27; do not add a third collision). Next free number: 32.
2. Create `transmissions/NN-your-slug.html` using Transmission 15 as template. The page's canonical,
   og:url, and JSON-LD urls use the extensionless route `https://www.unwindcode.ai/transmissions/NN-your-slug`.
3. Include at least 3 interactive elements from the table above.
4. Update `transmissions/index.html` — add new card at top of archive grid (href without `.html`),
   update featured card and the JSON-LD `numberOfItems` count.
5. Update `index.html` — swap first blog card to the new post (href without `.html`).
6. Add the extensionless URL to **both** `sitemap.xml` and `public/sitemap.xml`, and list the route in
   **both** `llms.txt` (Recommended Proof Artifacts) and `public/llms.txt`.
7. Register the transmission in `public/data/transmissions.json` (`route` extensionless,
   `source_file` with `.html`) and update `ai-services.json` metadata.
8. If a social packet ships with it, register it and run `node scripts/recompute-asset-digests.mjs`.
9. Run `npm test` (311+ tests must stay green) and `npm run check:public-parity`.
10. Run `npm run build`, then `npx serve dist -l 4199` and load the extensionless route to verify.
11. `git add -A && git commit && git push origin main` — ALWAYS commit before deploying.
12. Deploy: `npx vercel deploy --prod --yes` (project `jesus-casares-s-projects/dist`). Verify live:
    the new route returns 200 and appears in `https://www.unwindcode.ai/sitemap.xml`.

## SEO Checklist (per transmission)

- [ ] `<title>` with transmission number and `| Unwind Code`
- [ ] `<meta name="description">` — compelling 1-liner
- [ ] `<link rel="canonical">` — full URL, **extensionless, no trailing slash**
- [ ] `og:url` matches the canonical exactly
- [ ] Open Graph: `og:type`, `og:title`, `og:description`
- [ ] JSON-LD `Article` schema with author, publisher, dates
- [ ] Route present in both sitemaps and both llms.txt files


## Voice & Tone

- **Architectural, sharp, minimal.** Zero filler language.
- Write like an engineer explaining to a peer, not marketing copy.
- Use the organism metaphor consistently (cells, cortex, memory, synaptic).
- Every section earns its existence with either insight or interactivity.
