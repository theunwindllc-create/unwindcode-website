# Transmission 32 — The Silent Truncation — Instagram Carousel Packet

Internal creator distribution packet for Transmission 32. Prepared for manual review and manual posting only.

## Contents

- `carousel.html` — self-contained 4-slide source (1080×1080 per slide; open `carousel.html#slide-1` … `#slide-4`)
- `caption.md` — Instagram caption with source link, manual posting boundary, and slide alt text
- `caption.txt` — plain-text caption for direct paste
- `exports/slide-01.png` … `slide-04.png` — rendered 1080×1080 source exports
- `previews/slide-01-preview.png` … — 540×540 page-preview variants
- `ready-to-upload/01-silent-truncation.png` … — ordered upload set for Instagram
- `downloads/transmission-32-silent-truncation-carousel.zip` — bundled packet

## Boundary

This packet is internal creator material. It is not exposed through public transmission pages or visitor CTAs.
No automated posting, deployment, wallet, outreach, or answer-generation authority is granted by this packet.
Creator approval is required before any public posting.

## Regenerate

Render each `carousel.html#slide-N` at 1080×1080 with a headless browser, export PNGs into `exports/`,
downscale to 540×540 into `previews/`, copy ordered frames into `ready-to-upload/`, zip the packet into
`downloads/`, then run `node scripts/recompute-asset-digests.mjs` and `npm test`.
