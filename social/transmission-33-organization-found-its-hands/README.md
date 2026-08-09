# Transmission 33 — The Organization Found Its Hands — Instagram Carousel Packet

Internal creator distribution packet for Transmission 33. Prepared for manual review and manual posting only.

## Contents

- `carousel.html` — self-contained four-slide source (1080×1080 per slide; open `carousel.html#slide-1` through `#slide-4`)
- `caption.md` — caption with source URL, manual posting boundary, privacy boundary, slide alt text, and hashtags
- `exports/slide-01.png` through `slide-04.png` — rendered 1080×1080 exports
- `previews/slide-01-preview.png` through `slide-04-preview.png` — 540×540 previews
- `ready-to-upload/01-organization-found-its-hands.png` through `04-organization-found-its-hands.png` — ordered upload set
- `downloads/transmission-33-organization-found-its-hands.zip` — bundled creator handoff

## Boundaries

This packet is internal creator material. It is not exposed through public transmission pages or visitor CTAs. No automated posting, deployment, wallet, outreach, paid media, external sync, memory mutation, file mutation, or answer-generation authority is granted. Creator approval is required before public posting.

The second, pre-public persona is not named, depicted, or otherwise identified in this packet.

## Render

From the website root:

```bash
/Users/jesuscasares/.codex/skills/unwind-transmission-workflow/scripts/render-carousel.sh social/transmission-33-organization-found-its-hands 4
```

After rendering, create 540px previews, copy the ordered frames into `ready-to-upload/`, rebuild the ZIP, and run `npm test`.
