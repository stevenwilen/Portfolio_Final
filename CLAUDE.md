# stevenwilen.dev — working notes

One-page portfolio for Steven Wilen's custom-guide work. Plain static site.

## Stack

Three files, no build step, no dependencies: `index.html`, `styles.css`,
`script.js`. Vanilla HTML/CSS/JS — no framework, no bundler, no `package.json`.

**Do not introduce a build step or npm dependencies** without asking. Anything
copy-pasted from a component library (21st.dev, shadcn, etc.) is React + Tailwind
and has to be hand-ported to the tokens below — it will not drop in.

## Deploy — read this before assuming git is the source of truth

Hosted on Vercel at https://stevenwilen.dev. **The deploy source is not
identified.** The Vercel account reachable from this machine does not contain the
project, there is no `.vercel/` directory, and no second copy of the repo exists
locally.

This has already caused one silent divergence: on 2026-08-12 the live site was
found running commit `16bad9d` *plus* four changes that existed in no commit at
all — a favicon set, the removal of an entire section, an anchor fix, and a
mobile contact-card rule. They were recovered in `51ff430`.

So:

- Before assuming the repo matches production, **diff against the deploy**:
  `curl -sS https://stevenwilen.dev/styles.css -o /tmp/live.css` then compare with
  `diff --strip-trailing-cr`. Byte comparison via `git hash-object` also works.
- Never leave the deploy ahead of `main`. If you change the live site, commit it.
- Work on a branch, test locally, and only push when the change is confirmed —
  a push may or may not trigger a redeploy, which is itself unknown.

## Design tokens

Everything lives in `:root` at the top of `styles.css`. Use the tokens; do not
hardcode values that a token already covers.

- **Palette** — warm paper-craft. `--c-cream #f7ecd3` page base,
  `--c-vermillion #d8412a` the single focal accent, plus marigold / leaf / teal /
  kraft. Red is used *selectively*: warm neutrals (`--accent-tan`,
  `--accent-gold-muted`) carry most lines and icons so the red still lands.
- **Type** — Inter Tight, weights 400–800, loaded via `<link>` in the head.
  Do not move it back into an `@import` in the CSS; that serialises the font
  request behind the stylesheet download.
  Scale: `--fs-h1/h2/h2-sm/h3/lede/body`, and at the small end
  `--fs-eyebrow 12px` / `--fs-caption 12.5px` / `--fs-micro 11.5px`.
- **Small type rule** — `--fs-micro` is the floor for real page text. Type
  *inside* the device mockups (`.cc-chip-*`, `.tb-*`, `.gp-laptop-screen`) is
  deliberately smaller: it is simulated app UI, and shrinking it is what sells
  the illusion of a screenshot. Do not "fix" those.

## Layout rules that are easy to break

- **Proof board ladder** (`.rpp-*`). The evidence cards are photographs of dense
  documents, so column count is traded for column width, not the reverse:
  4 columns >1180px · 3 columns 901–1180 · 2 columns 641–900 · 1 column with
  paired thumbnails ≤640. Below roughly 300px of column width the text inside a
  scan is unreadable at any size.
- **Card pairing on phones** is opt-in, not default. Every `.rpp-card` is full
  width; a card only pairs when it actually adjoins another plain card
  (`:has(+ .rpp-card)` forward, `+` backward). This is what stops a lone card
  sitting in a half-width cell with an empty one beside it.
- **`.gp-laptop-base` is 112% of the lid** to read as a deck in perspective, so
  any container holding the laptop must cap the lid at ~89% or the flare pushes
  the page into horizontal scroll on small phones.
- **Hero floats bleed off both edges on purpose** above 640px. An automated
  "element is outside the viewport" check will flag them; that is not a bug.
  They are hidden entirely ≤640px — there is no width there that makes them
  legible without crowding the CTA.
- `html` and `body` both set `overflow-x: clip`. Clipping on `body` alone does
  not stop overflow from widening the layout viewport.

## Verifying changes

There is no test suite; verification is visual and measured. Screenshot at real
viewports and check the numbers rather than eyeballing one width.

**Reveal animations make naive screenshots lie.** `[data-reveal]` elements start
at `opacity: 0` and are revealed by an IntersectionObserver. A Puppeteer
`fullPage: true` screenshot resizes the viewport and can capture whole sections
blank — that is a capture artifact, not a broken layout. Capture the *viewport*
while scrolling in steps instead, and assert that no `[data-reveal]` still lacks
`.is-in` after a full scroll.

Widths worth checking: 320 (narrowest real phone), 393, 640/641 (pairing
boundary), 768, 820, 900/901 (proof-board boundary), 1024, 1180/1181, 1440.

## Known, deliberate leftovers

- **~63% of the CSS class surface is unreachable** (235 of 372 classes), mostly
  `.gp-rail*`, `.asset-frame*`, `.fcp-*`, `.tb-*` from a "Role & Task Guides"
  section that was removed. Roughly 8–10 KB gzipped.
  **Do not delete it by static analysis.** `script.js` builds class names by
  concatenation — `'gp-frame--' + ex.device`, `'gp-' + ex.device + '-screen'`,
  `'gp-deliv--' + ex.device` — where `ex.device` is `laptop`, `phone` or
  `tablet`. A grep-based sweep marks those live rules dead and silently breaks
  two of the three guide tabs. Removal needs runtime CSS coverage taken with all
  three tabs exercised, plus a pixel diff.
- At 600px wide the page is the tallest it gets (~6300px), because that width
  lands in the phone contact-sheet layout with large thumbnails. Correct, just
  tall; an uncommon viewport.
