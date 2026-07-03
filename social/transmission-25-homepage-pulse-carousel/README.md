# Transmission 25 Instagram Carousel

Format: 4 square slides, 1080x1080 PNG.

Source:

- `carousel.html` is the editable visual source.
- `caption.md` contains the post caption, slide copy, alt text, hashtags, and manual posting gate.
- `exports/` contains rendered PNG slides.
- `ready-to-upload/` contains the same slides with explicit Instagram upload filenames:
  `01-homepage-learned-to-pulse.png` through `04-authority-has-edges.png`.
- `previews/` contains 540x540 preview variants used by the Transmission 25 page.
- `downloads/transmission-25-homepage-pulse-carousel.zip` is the bundled posting packet with the upload-ready slides, previews, caption, README, and editable HTML source.

Source transmission:

https://www.unwindcode.ai/transmissions/25-the-homepage-learned-to-pulse

Export command:

```bash
for i in $(seq 1 4); do
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --window-size=1080,1080 \
    --screenshot="social/transmission-25-homepage-pulse-carousel/exports/slide-$(printf '%02d' "$i").png" \
    "file://$PWD/social/transmission-25-homepage-pulse-carousel/carousel.html#slide-${i}"
done
```

Posting note: this is a prepared asset package only. Public posting still requires Creator approval.
