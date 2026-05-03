# DESIGN.md — Steven Wilen Portfolio
> This file is the single source of truth for all design and content decisions.
> Nothing gets coded until it is written and confirmed here.
> All sections are [LOCKED] unless marked [PENDING].

---

## 1. Project overview [LOCKED]

**Owner:** Steven Wilen
**Email:** steven.wilen@gmail.com
**Type:** Personal freelance portfolio
**Purpose:** Attract B2B clients who need instructional or training content built
**Distribution:** Shared via LinkedIn and cold outreach messages
**Primary viewer:** CTO, Head of Customer Success, or Training Manager at a small to mid-sized tech company

---

## 2. Core creative direction [LOCKED]

The site leads with the work, not the person. No bio up front, no credentials. The visitor experiences the process of building a course — step by step — before they ever see a finished product. By the time they reach the work sample, they already understand exactly what went into it.

Visual reference: Cambrian Innovation (cambrianinnovation.com) — adapted to warm off-white base instead of teal, with a strict two-tone palette of off-white and dark navy. No accent color.

The visitor's intended first reaction: *"I want something that looks like that for my product."*

---

## 3. Site sections — order and purpose [LOCKED]

Sections appear in this order on the page:

### Section 1 — Hero
- Headline left, strong visual right — split layout, not centered
- Small uppercase section label above the headline
- Headline is very large, ultra-heavy font weight, tight leading
- Subheadline below in regular weight, smaller size
- Outline style CTA button — no fill, dark navy border and text
- No work sample here
- One signature fade-in reveal on page load

### Section 2 — Process (scrolling animation)
- Sticky image left, step text right
- Step 1 visible immediately on arrival — no scroll needed to trigger it
- Each scroll step crossfades the image and updates the step text
- Step numbers in dark navy, small uppercase tracked
- Final image (course_draft_ss.png) fades out naturally into the interactive course below
- Uses a dummy course as the working example

### Section 3 — Interactive course
- Real coded course mockup in normal document flow directly below process section
- No fixed overlay — just the next thing on the page as you scroll past Step 5

### Section 4 — Work sample
- Morpheus Drive Quick Start as a real completed project
- Structured project card format
- Full-width or two-column layout — Cambrian-style split with text left, visual right

### Section 5 — Services
- Three-column layout like Cambrian's approach section (Image 4)
- Large icon or graphic above each service
- Bold heading, short description below
- Clean, generous spacing

### Section 6 — Contact
- Full-width dark navy section — Cambrian's dark contrast section style
- Large bold headline on the left
- Outline CTA button — white border and text on dark navy background
- No form — just the email CTA

---

## 4. Copy — complete [LOCKED]

### Hero section

**Section label:** Instructional content developer
**Headline:** I turn what your team knows into content they can teach.
**Subheadline:** Instructional content for anyone with complex knowledge worth teaching.
**CTA:** Get in touch

---

### Process section — scroll steps

**Step 1:** You send source material
Existing docs, a product recording, a walkthrough video — whatever you have. I work from raw material. No polished brief needed.

**Step 2:** I map a structure
Before anything gets written, I break the subject into a proposed curriculum: modules, sequence, and what each lesson needs to accomplish. You review it, we align, then I start building.

**Step 3:** Drafts go out in stages
Scripts first, then recordings, then supporting text and diagrams — in reviewable pieces, not all at once when it's too late to redirect. I use Claude and other AI tools to keep the pace fast without sacrificing accuracy.

**Step 4:** Revisions happen in defined rounds
Each round has a clear scope and a close. No open-ended feedback loops, no ambiguity about what's still in play.

**Step 5:** Delivery is ready to publish
Final files are named, organized, and formatted for your LMS. Nothing left for you to assemble.

---

### Work sample — Morpheus Drive Quick Start

**Course title:** Morpheus Drive Quick Start

**Course description:**
A structured onboarding course built for a robotics hardware company's LMS. Covers hardware setup, app connection, and movement control — from unboxing to operational in three modules.

**Modules:**
1. Morpheus Drive Hardware Setup
2. CoreOS App Setup
3. Scanning and Movement

**Videos:**
1. Morpheus Drive Setup
2. CoreOS App Setup
3. Scanning and Movement

**Deliverables shown on card:** Structured curriculum, video tutorials, LMS integration

---

### Services section

**Section label:** What I build
**Heading:** Every format your knowledge needs

- **Curriculum design** — Turning a system or process into a structured learning path.
- **Written content** — Documentation, SOPs, knowledge base articles, and course text.
- **Video tutorials** — Script, structure, and production.
- **Visual and diagram work** — Diagrams, flowcharts, and supporting graphics.
- **LMS-ready content packages** — Formatted and organized for direct publishing.

---

### Contact section

**Section label:** Work with me
**Headline:** Let's talk about what you need built.
**Body:** If you're a CTO, Head of Customer Success, or Training Manager looking to turn your product knowledge into something teachable — I'd like to hear about it.
**CTA label:** Get in touch
**CTA link:** mailto:steven.wilen@gmail.com

---

### Footer

Steven Wilen

---

## 5. Visual identity [LOCKED]

### Color — two tone only, no accent color

- **Background:** #F7F5F0 — warm off-white, used on all light sections
- **Primary text / Headlines:** #12243A — very dark navy, not pure black
- **Secondary text:** #6B6B60 — muted warm grey for body copy and labels
- **Dark sections:** #12243A — full-bleed dark navy for contact section and any contrast sections
- **Dark section text:** #F7F5F0 — warm off-white text on dark navy backgrounds
- **Borders / dividers:** #E8E6E0 — soft warm-toned, very subtle
- **No accent color anywhere on the site**

### Buttons — outline style only

- **On light backgrounds:** Transparent fill, #12243A border (1.5px), #12243A text. Hover: fills solid #12243A, text becomes #F7F5F0
- **On dark backgrounds:** Transparent fill, #F7F5F0 border (1.5px), #F7F5F0 text. Hover: fills solid #F7F5F0, text becomes #12243A
- **Border radius:** 4px — slightly rounded, not pill shaped
- **Padding:** 12px 28px
- **No shadows, no gradients, no color fills by default**

### Typography

- **Approach:** All sans-serif — geometric, clean, modern
- **Typeface:** Inter — loaded from Google Fonts
- **Hero headline:** 700-800 weight, very large (clamp 48px–80px), letter-spacing -0.03em, line-height 1.05
- **Section headlines:** 700 weight, large (clamp 36px–56px), letter-spacing -0.02em
- **Section labels / kickers:** 500 weight, 11px, letter-spacing 0.12em, uppercase, #6B6B60
- **Body copy:** 400 weight, 16px, line-height 1.7, #6B6B60
- **Step numbers:** 500 weight, 11px, uppercase, tracked, #12243A

### Layout — Cambrian-inspired

- **Split layouts:** Headline/text left (45%), visual/image right (55%) — not centered
- **Section padding:** 120px top and bottom on desktop
- **Max content width:** 1200px centered
- **Three-column services:** Equal columns, generous gap, icon above, heading, description
- **Full-bleed dark contact section:** No max-width constraint on background, content still 1200px

### Motion and animation

- **Hero:** Single fade-in with subtle upward drift on page load
- **Process section:** Scroll-driven image crossfade — sticky layout, image left, text right
- **Everything else:** Sits still. No scroll animations outside the process section.
- **Button hover:** Fill transition only — 150ms ease. No movement.

### Navigation

- **Approach:** No navigation bar
- **Reasoning:** Page tells its own story top to bottom

### Mobile behavior

- **Approach:** Simplified — everything stacks vertically, single column
- **Split layouts collapse:** Text stacks above image on mobile
- **Process section:** Static list of 5 steps, no scroll animation
- **Full experience on desktop only**

---

## 6. Build phases [LOCKED]

- **Phase 1:** Complete DESIGN.md ✓ *complete*
- **Phase 2:** HTML structure ✓ *complete*
- **Phase 3:** Layout and spacing ✓ *complete*
- **Phase 4:** Colors and typography ✓ *complete*
- **Phase 5:** Animations and interactions ✓ *complete*

**Current status:** Full visual redesign in progress — Cambrian-inspired two-tone style replacing previous amber accent design.

---

*Last updated: Full visual redesign — Cambrian-inspired, two-tone navy and off-white, outline buttons, no accent color*
