# Production build — Steven Wilen · Web Guides

Vanilla HTML/CSS/JS, no framework, no build step — same stack your current site uses. Three files replace everything in the repo except the icon/manifest assets.

## Replacing the live site

1. In `Portfolio_Final/`, delete: `index.html`, `styles.css`, `script.js`, `images/`, `videos/`, and `CLAUDE.md` if it only described the old design.
2. Copy in the three files from this folder: `index.html`, `styles.css`, `script.js`.
3. Keep these as they are — the new `index.html` still references them: `favicon.ico`, `favicon-96x96.png`, `apple-touch-icon.png`, `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png`, `site.webmanifest`, `og-image.jpg`.
4. Commit and push to `main`. Vercel redeploys automatically.

Nothing from the previous design survives: old palette, Archivo, the paper-craft CSS, the hero device drawings, the proof board, and the 3,467-line stylesheet are all gone.

## Still placeholder

- **Phone screens** — three empty slots labelled "Guide screen 1–3". Replace each `<div class="slot">` with `<img src="images/…" alt="…">` when you pick the screenshots.
- **Examples** — tabs read "Example 1–4"; bullets and results are neutral copy. Real labels go in `script.js` (`EXAMPLES`) and `index.html` (the four `.tab` buttons).
- **Visual panel** — a dashed "Visual to come" box.
- **Phone number** — `tel:+10000000000` and `sms:+10000000000` in the mobile Call/Text buttons.
- **`og-image.jpg`** still shows the old design; regenerate it when the new site is live.
