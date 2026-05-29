# Transmission 24 Instagram Carousel

Format: 8 square slides, 1080x1080 PNG.

Source:

- `carousel.html` is the editable visual source.
- `caption.md` contains the post caption, alt text, hashtags, and manual posting gate.
- `exports/` contains rendered PNG slides.

Export command:

```bash
for i in 1 2 3 4 5 6 7 8; do
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --window-size=1080,1080 \
    --screenshot="social/transmission-24-mirror-carousel/exports/slide-0${i}.png" \
    "file://$PWD/social/transmission-24-mirror-carousel/carousel.html#slide-${i}"
done
```

Posting note: this is a prepared asset package only. Public posting still requires Creator approval.
