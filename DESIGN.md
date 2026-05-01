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

The visitor's intended first reaction: *"I want something that looks like that for my product."*

---

## 3. Site sections — order and purpose [LOCKED]

Sections appear in this order on the page:

### Section 1 — Hero
- Headline and subheadline only
- No work sample here
- One signature fade-in reveal on page load

### Section 2 — Process (scrolling animation)
- The backbone of the entire page
- Each scroll step reveals one stage of the process
- Uses a dummy course as the working example — not the Morpheus Drive project
- The dummy course subject should be generic and universally relatable (e.g. employee onboarding or product training)
- At the final scroll step, the completed course is revealed in full
- Animation spec: [PENDING — to be discussed]

### Section 3 — Work sample
- Morpheus Drive Quick Start featured as a real completed project
- Structured project card format
- Positioned after the process section as proof that the process works

### Section 4 — Services
- Explains what Steven offers, in what forms

### Section 5 — Contact
- Single clean close
- Primary CTA: direct email

---

## 4. Copy — complete [LOCKED]

### Hero section

**Headline:** I turn what your team knows into content they can teach.
**Subheadline:** Instructional content for anyone with complex knowledge worth teaching.

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

**Final reveal:** Completed course shown in full — dummy course example

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

**Heading:** What I build

- **Curriculum design** — Turning a system or process into a structured learning path.
- **Written content** — Documentation, SOPs, knowledge base articles, and course text.
- **Video tutorials** — Script, structure, and production.
- **Visual and diagram work** — Diagrams, flowcharts, and supporting graphics.
- **LMS-ready content packages** — Formatted and organized for direct publishing.

---

### Contact section

**Headline:** Let's talk about what you need built.

**Body:** If you're a CTO, Head of Customer Success, or Training Manager looking to turn your product knowledge into something teachable — I'd like to hear about it.

**CTA label:** Get in touch
**CTA link:** mailto:steven.wilen@gmail.com

---

### Footer

Steven Wilen

---

## 5. Visual identity [LOCKED]

### Color
- **Background:** Warm off-white — slightly creamy, soft on the eye (approx. #F7F5F0)
- **Text:** Near-black (approx. #1A1A18)
- **Accent:** Warm green — used on CTAs, highlights, and key details (approx. #3A7C5A)
- **Secondary text:** Muted mid-tone for labels and supporting copy (approx. #6B6B60)
- **Borders / dividers:** Subtle, low-contrast, warm-toned

### Typography
- **Approach:** All sans-serif — geometric, clean, modern
- **Typeface:** Inter — loaded from Google Fonts
- **Heading weight:** Heavy — large, confident, tight letter-spacing
- **Body weight:** Regular — comfortable reading size, generous line height
- **Labels / kickers:** Small, uppercase, tracked out, secondary text color

### Motion and animation
- **Approach:** Scroll-driven in the process section only — everything else is static
- **Hero:** Single fade-in with subtle upward drift on page load
- **Process section:** Scroll-triggered animation at each step — spec [PENDING]
- **Everything else:** Sits still. No entrances, no parallax, no flourishes.
- **CTA hover:** Subtle tonal shift on green button — no movement

### Work sample display
- **Format:** Structured project card
- **Shows:** Course components, scope, and structure of what was built
- **Content:** Course title, description, three modules, three videos, deliverables list
- **Feel:** Clean, designed, breaks the deliverable into its parts

### Spacing
- **Approach:** Generous — lots of breathing room between sections and elements
- **Sections:** Wide vertical padding, content never feels crowded
- **Feel:** Premium, unhurried, confident

### Navigation
- **Approach:** No navigation bar
- **Reasoning:** Page tells its own story top to bottom

### Mobile behavior
- **Approach:** Simplified — everything stacks vertically
- **No complex layouts on mobile** — single column, clean, readable
- **Full experience on desktop only**

---

## 6. Build phases [LOCKED]

- **Phase 1:** Complete DESIGN.md — all visual decisions locked ✓ *complete*
- **Phase 2:** HTML structure only, no CSS ✓ *complete*
- **Phase 3:** Layout and spacing only ✓ *complete*
- **Phase 4:** Colors and typography ✓ *complete*
- **Phase 5:** Animations and interactions ✓ *complete*

**Note:** Layout has been revised after Phase 5. Process animation spec is PENDING. Dummy course mockup built as design reference ahead of process section build.

No spontaneous visual decisions inside the code. Every decision is made in chat first and recorded here.

---

## 7. Dummy course mockup [LOCKED]

A fully interactive LMS-style prototype built as a design reference. Lives below the footer in index.html — not part of the final page layout. Purpose: screenshotted as a visual asset for the process scroll animation section.

### Visual treatment
- **Shell:** White background, subtle border, soft drop shadow — reads as an elevated card separate from the page
- **Sidebar:** White background with a single right-side divider. Modern, not dark. Green accent indicator on the active lesson (left border + tinted background). Module headers in small uppercase muted text.
- **Content area:** White background, generous padding

### Course content
**Course title:** Product Certification Program

**Structure:**
- Module 1: Product Overview
- Module 2: Core Features Walkthrough
- Module 3: Advanced Use Cases
- *(standalone, no module label)* — Practice Questions

**Lessons and layouts:**

| Lesson | Layout |
|---|---|
| Introduction to the Platform | Written + hub diagram |
| Key Concepts and Terminology | Written + glossary (6 terms, two-column) |
| Core Features Overview | Written + video + flow diagram |
| Hands-On Walkthrough | Written + video |
| Common Use Patterns | Written + three-column use case cards |
| Advanced Configuration | Written + decision diagram (branching flow) |
| Integration Scenarios | Written + hub diagram |
| Practice Questions | Interactive quiz cards (4 questions, click to reveal correct/incorrect) |

### Interactivity
- Clicking any lesson in the sidebar switches the active state, renders the lesson content, and updates the progress bar
- Next lesson button appears bottom-right of each lesson — shows the next lesson title, advances on click
- Practice Questions: clicking an answer option highlights it green (correct) or red (incorrect)
- Progress bar reflects position of current lesson across all 8 lessons

### Decisions
- No Module 4 / Certification Assessment — removed
- Practice Questions sits outside any module, separated by a subtle top divider
- Hub diagram center box uses doubled horizontal padding for legibility

---

*Last updated: Dummy course mockup built and documented — process animation spec PENDING*
