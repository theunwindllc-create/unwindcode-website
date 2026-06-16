# Transmission 26 Instagram Carousel

Format: 4 square slides, 1080x1080 PNG.

Source:

- `carousel.html` is the editable visual source.
- `caption.md` contains the post caption, slide copy, alt text, hashtags, and manual posting gate.
- `exports/` contains rendered PNG slides.
- `ready-to-upload/` contains the same slides with explicit Instagram upload filenames:
  `01-property-sales-intelligence-cell.png` through `04-approval-owns-motion.png`.
- `previews/` contains 540x540 preview variants used by the Transmission 26 page.
- `downloads/transmission-26-property-sales-intelligence-cell.zip` is the bundled posting packet with the upload-ready slides, previews, caption, README, and editable HTML source.

Source transmission:

https://www.unwindcode.ai/transmissions/26-property-sales-intelligence-cell

Export command:

```bash
for i in $(seq 1 4); do
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --window-size=1080,1080 \
    --screenshot="social/transmission-26-property-sales-intelligence-cell/exports/slide-$(printf '%02d' "$i").png" \
    "file://$PWD/social/transmission-26-property-sales-intelligence-cell/carousel.html#slide-${i}"
done
```

Posting note: this is a prepared asset package only. Public posting still requires Creator approval.
