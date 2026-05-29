# Transmission 24 Instagram Carousel

Format: 12 square slides, 1080x1080 PNG.

Source:

- `carousel.html` is the editable visual source.
- `caption.md` contains the post caption, alt text, hashtags, and manual posting gate.
- `exports/` contains rendered PNG slides.

Export command:

```bash
for i in $(seq 1 12); do
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --window-size=1080,1080 \
    --screenshot="social/transmission-24-mirror-carousel/exports/slide-$(printf '%02d' "$i").png" \
    "file://$PWD/social/transmission-24-mirror-carousel/carousel.html#slide-${i}"
done
```

Posting note: this is a prepared asset package only. Public posting still requires Creator approval.
