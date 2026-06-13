# Transmission 26 Property Sales Intelligence Carousel

Format: 8 square slides, 1080x1080 PNG, with 540x540 previews and ready-to-upload copies.

Source:

- `carousel.html` is the editable visual source.
- `caption.md` contains the post caption, alt text, hashtags, and manual posting gate.
- `exports/` contains rendered PNG slides.
- `previews/` contains 540x540 review previews.
- `ready-to-upload/` contains manually named PNG files for creator review.
- `downloads/` contains the prepared ZIP package.

Export command:

```bash
for i in $(seq 1 8); do
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --window-size=1080,1080 \
    --screenshot="social/transmission-26-property-sales-intelligence-cell-carousel/exports/slide-$(printf '%02d' "$i").png" \
    "file://$PWD/social/transmission-26-property-sales-intelligence-cell-carousel/carousel.html#slide-${i}"
done
```

Posting note: this is a prepared asset package only. Creator approval is required before publishing publicly. The package grants no authority for lead import, outreach, paid media, automated posting, or provider activation.
