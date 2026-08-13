# stevenwilen.dev — working notes

One-page portfolio for Steven Wilen's custom-guide work. Plain static site.

## Stack

Three files, no build step, no dependencies: `index.html`, `styles.css`,
`script.js`. Vanilla HTML/CSS/JS — no framework, no bundler, no `package.json`.

**Do not introduce a build step or npm dependencies** without asking. Anything
copy-pasted from a component library (21st.dev, shadcn, etc.) is React + Tailwind
and has to be hand-ported to the tokens below — it will not drop in.

## Deploy

Hosted on Vercel at https://stevenwilen.dev, deployed automatically from
`main` of `github.com/stevenwilen/portfolio_final`. Confirmed on 2026-08-12: a
push to `main` was live within a minute, byte-identical to the working tree.

The Vercel *account* that owns the project is not the one reachable from this
machine (the connected account holds five unrelated projects), so deployment
logs and project settings cannot be inspected from here — only the result, by
fetching the site.

**A push to `main` publishes immediately.** Test locally first; there is no
staging step between the push and the live site.

Watch for drift in the other direction. On 2026-08-12 the live site was found
running commit `16bad9d` *plus* four changes that were not in any commit — the
work had been deployed from a machine whose commits had not been pushed. (Those
commits, `8638d5d` and `464c6c0`, later arrived upstream and proved identical.)
If more than one machine edits this site, verify before assuming git is current:

```sh
curl -sS https://stevenwilen.dev/styles.css -o /tmp/live.css
diff --strip-trailing-cr styles.css /tmp/live.css
```

## Design tokens

Everything lives in `:root` at the top of `styles.css`. Use the tokens; do not
hardcode values that a token already covers.

- **Palette** — warm near-white paper. `--c-surface #fdfbf7` (body + cards),
  `--c-cream #f8f5ef` (page base), `--c-cream-2 #efeae0` (hero + deep bands).
  `--c-vermillion #d8412a` is the single focal accent, plus marigold / leaf /
  teal / kraft. Red is used *selectively*: warm neutrals (`--accent-tan`,
  `--accent-gold-muted`) carry most lines and icons so the red still lands.
  **The neutrals were shifted off cream toward white in Aug 2026.** Accents were
  deliberately left untouched. If you add a paper tone, match the *relative*
  step between those three — collapsing them flattens the section separation.
  Note that warm tones also appear hardcoded as `rgba()` triples inside the hero
  gradients and the torn-divider fill; a token-only change misses those.
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
  ≤640px only two are kept (`--notes`, `--checklist`), tucked under the torn
  divider and bleeding off the side edges. **They are decoration — not meant to
  be seen whole.** They are sized to feel like real guides on a desk, so on
  phones their slots are overridden to a 5:3 landscape crop with
  `object-position: top`; without that override the extra width also buys extra
  height and they collide with the CTA. That override needs an extra class
  (`.hero-float.hero-float--notes …`) to outrank the per-card `aspect-ratio`
  rules further down the sheet. The hero also takes 92px of extra bottom
  padding on phones purely to open the band they sit in.
- **The guide tabs' first tab is duplicated in static HTML.** `script.js`
  renders the other tabs on click, but the first is written out in `index.html`
  so the section works before/without JS. Reordering the tabs means also
  rewriting that static block — device frame, image, and the In the guide /
  Result copy — to mirror what `buildDevice()` emits for the new first tab.
  Current order: Open House (`cust-04`, phone, **solo** — no access card) ·
  Workshop (`cust-02`, tablet) · Rental (`cust-01`, phone) · Student Build
  (`cust-03`, laptop).
- **Device widths are set twice, and the `.cg-device` scope wins.** There is a
  generic `.gp-frame--phone .gp-deliv--phone` block around line 4124 and a
  `.cg-device .gp-frame--phone .gp-deliv--phone` block around line 4800. They
  have equal specificity, so the later `.cg-device` one always wins inside the
  Customer Guides section. Editing only the generic block silently does nothing
  — that is what left the solo phone rendering at 189px instead of 362px.
- **The solo phone needs its stage capped at every width, not just desktop.**
  `.cg-showcase:has(.gp-frame--phone.gp-frame--solo) .cg-device` caps the stage
  to 412px (336px below 920px, where the showcase stacks). Without the
  below-920 cap the phone takes the full 600px stage, renders ~1060px tall, and
  adds ~1200px to the page between 768 and 919px.
- **Device mockup proportions are sized in `cqw`**, not pixels, via
  `container-type: inline-size` on the device wrapper. Fixed px bezels only look
  right at one width — the tablet's 12px/32px read as 3.0%/7.9% at desktop size
  but 5.7%/15.1% on a phone, which is why it looked like a thick toy. Bezel,
  corner radius, screen radius and the camera dot must scale together; px
  fallbacks are kept ahead of the `@supports` block.
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
- At 600px wide the page is the tallest it gets (~6200px), because that width
  lands in the phone contact-sheet layout with large thumbnails. Correct, just
  tall; an uncommon viewport.
- **Phones hide several blocks rather than shrinking them** — the contact
  support paragraph, the duplicate "or email me directly" line, the six drifting
  contact chips, the footer's Formats column, and the `.cg-flow` process strip
  under the examples. All stay in the DOM for wider screens; the closing ask on
  a phone is one question, one sentence, one button. See the trim block at the
  end of `styles.css`.
