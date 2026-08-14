# stevenwilen.dev

One-page site for Steven Wilen's web-guide work. Vanilla HTML, CSS and JS. No
framework, no build step, no dependencies: `index.html`, `styles.css`,
`script.js`, plus the icon and manifest assets at the root.

## Deploy

Hosted on Vercel, deployed from `main`. A push goes live within about a minute,
so test locally before pushing. There is no staging step.

## Still placeholder

These are live on the site right now.

- **Phone screens.** Three empty slots labelled "Guide screen 1" through
  "Guide screen 3". Swap each `<div class="slot">` for an `<img>` once you pick
  the screenshots.
- **Example tabs.** The four tabs read "Example 1" through "Example 4", and the
  bullets and result lines under them are filler. Real labels go in `EXAMPLES`
  in `script.js` and the four `.tab` buttons in `index.html`.
- **Work visual.** A dashed box reading "Visual to come".
- **Phone number.** The mobile Call and Text buttons point at
  `tel:+10000000000` and `sms:+10000000000`. The email link is real.
- **`og-image.jpg`.** Still shows the old design, so link previews are wrong.
  Regenerate it.
