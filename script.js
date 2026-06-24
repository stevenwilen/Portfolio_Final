

// (course-player + process-pipeline mockup handlers removed in 2026-06 revamp)


// ─── Footer year ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  var y = document.getElementById('footer-year');
  if (y) y.textContent = new Date().getFullYear();
});


// ─── Reveal-on-scroll (data-reveal) ──────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  var prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  els.forEach(function (el) {
    var step = parseInt(el.getAttribute('data-reveal-delay'), 10);
    if (!isNaN(step) && step > 0) {
      el.style.setProperty('--d', (step * 120) + 'ms');
    }
    io.observe(el);
  });
});











// ─── Hero floats: settle-in → multi-axis desk drift + scroll parallax ─
// Cards are background/ambient — no hover or mouse-responsive behavior. Pure passive motion.
document.addEventListener('DOMContentLoaded', function () {
  var prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var hero = document.getElementById('hero');
  if (!hero) return;

  var parallaxEls = hero.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  // Per-card config + state. Drift periods/amps and settle params are spread per index
  // so no two cards share a rhythm — that's what makes the orbit feel calm, not synchronized.
  var els = Array.prototype.map.call(parallaxEls, function (el, i) {
    var phaseStyle = getComputedStyle(el).getPropertyValue('--phase').trim();
    var phaseMs = parseFloat(phaseStyle) * (phaseStyle.indexOf('ms') !== -1 ? 1 : 1000);
    if (isNaN(phaseMs)) phaseMs = 0;
    var rotStyle = getComputedStyle(el).getPropertyValue('--rot').trim();
    var restRot = parseFloat(rotStyle);
    if (isNaN(restRot)) restRot = 0;

    // Capture the per-card target opacity (set in CSS) so the settle fade-in lands on it
    var targetOpacity = parseFloat(getComputedStyle(el).opacity) || 1;

    // Stagger initial offset side based on which corner the card lives in (left vs right)
    var rect = el.getBoundingClientRect();
    var heroRect = hero.getBoundingClientRect();
    var fromLeft = (rect.left + rect.width / 2) < (heroRect.left + heroRect.width / 2);
    var offsetSign = fromLeft ? -1 : 1;

    return {
      el: el,
      pScroll: parseFloat(el.getAttribute('data-parallax')) || 0.2,
      phase: phaseMs,
      restRot: restRot,
      // Drift: amplitudes halved and periods extended ~1.5× for a calmer feel.
      xPeriod: 14000 + (i * 1500),               // 14 - 20s
      yPeriod: 17000 + (i * 1100),               // 17 - 22s
      rotPeriod: 20000 + (i * 2200),             // 20 - 29s
      xAmp: 3 + (i % 3) * 1.0,                   // 3.0 - 5.0px
      yAmp: 2.5 + (i % 3) * 0.9,                 // 2.5 - 4.3px
      rotAmp: 0.3 + (i % 3) * 0.2,               // 0.3 - 0.7deg
      // Settle: 900-1400ms with 80-140ms stagger
      settleDelay: i * 110,                       // 0, 110, 220, 330, 440ms
      settleDuration: 1100 + (i % 3) * 80,        // 1100 - 1260ms
      initialOffsetX: offsetSign * (14 + i * 2),  // cards arrive from off-center
      initialOffsetY: -14,
      initialRotDelta: (restRot >= 0 ? 1 : -1) * 5,
      targetOpacity: targetOpacity,
      settled: false
    };
  });

  // Under reduced motion: set static final state and exit. No RAF, no drift, no parallax.
  if (prefersReduced) {
    els.forEach(function (item) {
      item.el.style.setProperty('--tx', '0px');
      item.el.style.setProperty('--ty', '0px');
      item.el.style.setProperty('--total-rot', item.restRot + 'deg');
    });
    return;
  }

  // Pre-settle initial state — offset and faded out, ready for the settle-in
  els.forEach(function (item) {
    item.el.style.opacity = '0';
    item.el.style.setProperty('--tx', item.initialOffsetX + 'px');
    item.el.style.setProperty('--ty', item.initialOffsetY + 'px');
    item.el.style.setProperty('--total-rot', (item.restRot + item.initialRotDelta) + 'deg');
  });

  // Eased deceleration with ~10% overshoot — the "tiny overshoot" on settle
  function easeOutBack(t) {
    var s = 1.10;
    var t1 = t - 1;
    return 1 + (s + 1) * t1 * t1 * t1 + s * t1 * t1;
  }
  function easeOutCubic(t) {
    var t1 = 1 - t;
    return 1 - t1 * t1 * t1;
  }

  var scrollOffset = 0;
  var heroInView = true;
  var rafId = null;
  var startTime = null;

  function tick(ts) {
    if (startTime === null) startTime = ts;
    var elapsed = ts - startTime;

    for (var i = 0; i < els.length; i++) {
      var item = els[i];

      // ── Settle contribution (eases to 0 once the card has landed) ──
      var localT = (elapsed - item.settleDelay) / item.settleDuration;
      var settleTx = 0, settleTy = 0, settleRotDelta = 0;
      var settleAlpha;

      if (localT < 0) {
        // Card hasn't started moving yet — hold the offset
        settleTx = item.initialOffsetX;
        settleTy = item.initialOffsetY;
        settleRotDelta = item.initialRotDelta;
        settleAlpha = 0;
      } else if (localT < 1) {
        // In flight: eased deceleration, no overshoot (calmer settle).
        var posEase = easeOutCubic(localT);
        settleTx = item.initialOffsetX * (1 - posEase);
        settleTy = item.initialOffsetY * (1 - posEase);
        settleRotDelta = item.initialRotDelta * (1 - posEase);
        // Opacity reaches 1 faster than position, so the fade-in finishes while the
        // overshoot is still resolving — feels like the card lands "in place"
        settleAlpha = easeOutCubic(Math.min(localT * 1.5, 1));
      } else {
        settleAlpha = 1;
        if (!item.settled) {
          item.settled = true;
          // Hand opacity back to the CSS per-card rule (0.78 raw / 0.90 output)
          item.el.style.opacity = '';
        }
      }

      // ── Desk drift: independent x/y/rotation oscillators ──
      var driftX = Math.sin((elapsed + item.phase) / item.xPeriod * Math.PI * 2) * item.xAmp;
      var driftY = Math.cos((elapsed + item.phase) / item.yPeriod * Math.PI * 2) * item.yAmp;
      var driftRotDelta = Math.sin((elapsed + item.phase) / item.rotPeriod * Math.PI * 2) * item.rotAmp;

      // ── Scroll parallax ──
      var scrollTy = scrollOffset * item.pScroll;

      var totalTx = settleTx + driftX;
      var totalTy = settleTy + driftY + scrollTy;
      var totalRot = item.restRot + settleRotDelta + driftRotDelta;

      item.el.style.setProperty('--tx', totalTx.toFixed(2) + 'px');
      item.el.style.setProperty('--ty', totalTy.toFixed(2) + 'px');
      item.el.style.setProperty('--total-rot', totalRot.toFixed(3) + 'deg');

      if (!item.settled) {
        item.el.style.opacity = (settleAlpha * item.targetOpacity).toFixed(3);
      }
    }

    if (heroInView) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  function start() {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }

  // Pause RAF when hero leaves viewport — saves cycles when user scrolls down
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        heroInView = entry.isIntersecting;
        if (heroInView) start();
      });
    }, { threshold: 0 });
    io.observe(hero);
  }

  var ticking = false;
  function onScroll() {
    if (ticking || !heroInView) return;
    ticking = true;
    requestAnimationFrame(function () {
      var rect = hero.getBoundingClientRect();
      scrollOffset = -rect.top * 0.4;
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  start();
});


// ─── Guide-example showcases: selector tab switching ─────────
// Two sections (Role & Task Instructions, Customer Guides) each render
// their first example statically so they work without JS. This wires up
// every .gp-section's tabs to swap the context panel + preview from a
// shared data map keyed by data-example. Examples without an image show a
// "sample coming soon" frame.
document.addEventListener('DOMContentLoaded', function () {
  var sections = Array.prototype.slice.call(document.querySelectorAll('.gp-section'));
  if (!sections.length) return;

  var prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var EXAMPLES = {
    // ── Role & Task Instructions (Drive / file packages) ──
    'role-01': {
      kind: 'role',
      category: 'For staff',
      title: 'Front Desk Opening Handoff System',
      folder: 'Front Desk Opening',
      lead: 'A sample handoff package for a small fitness studio\'s opening shift.',
      problem: 'Opening relied on memory and repeated explanations, so steps got missed and managers couldn\'t easily confirm the shift was done.',
      howItWorks: 'Staff follow the guide, complete the checklist, and submit forms. Responses feed into the manager tracker automatically.',
      built: ['Start Here Guide', 'Opening Checklist', 'Completion Form', 'Issue Report Form', 'Manager Tracker', 'QR / Mobile Access'],
      image: 'images/role-guides/role-front-desk-drive.webp',
      imageAlt: 'Google Drive package for the Front Desk Opening Handoff System — folder containing a Start Here Guide, Opening Checklist, Completion Form, Issue Report Form, Manager Tracker, printable cheat sheet, and a QR / mobile access card.',
      caption: 'Front Desk Opening · Staff handoff package in Google Drive'
    },
    'role-02': {
      kind: 'role',
      category: 'For new hires',
      title: 'New Staff Training Package',
      folder: 'New Staff Training',
      lead: 'A sample onboarding package for a small business training a new part-time hire.',
      problem: 'New hires kept asking the same questions, with no easy way to see what they had actually covered.',
      howItWorks: 'The hire follows a start-here guide and checklist and marks each step done, so managers can track progress at a glance.',
      built: ['Start Here Guide', 'First Week Checklist', 'Tool Walkthrough', 'Daily Task Reference', 'Progress Tracker', 'QR / Mobile Access'],
      image: 'images/role-guides/role-staff-training-drive.webp',
      imageAlt: 'New Staff Training Guide package — a Start Here guide, first-week checklist, tool walkthrough, common questions, daily task reference, manager notes, and an editable training doc.',
      caption: 'New Staff Training · Staff handoff package in Google Drive'
    },
    'role-03': {
      kind: 'role',
      category: 'For volunteers',
      title: 'Event Day Role Package',
      folder: 'Event Day Roles',
      lead: 'A sample role package for volunteers helping run a local event.',
      problem: 'Volunteers arrived unsure of their role or who to ask, with no quick way to confirm each station was covered.',
      howItWorks: 'Each volunteer scans a QR code, follows their station checklist, and reports issues, so the lead sees coverage in one place.',
      built: ['Role Guide', 'Station Checklists', 'Arrival Instructions', 'Event Map', 'Issue Form', 'QR / Mobile Access'],
      image: 'images/role-guides/role-event-day-drive.webp',
      imageAlt: 'Event Day Role Guide package — a volunteer guide, role checklists, arrival instructions, an event map, a contact sheet, an issue form, and QR access.',
      caption: 'Event Day Roles · Staff handoff package in Google Drive'
    },
  };

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  // Classify a package file by its label so its tile gets the right glyph.
  function tileType(label) {
    var s = String(label).toLowerCase();
    if (/qr/.test(s)) return 'qr';
    if (/checklist/.test(s)) return 'checklist';
    if (/tracker/.test(s)) return 'tracker';
    if (/\bform\b/.test(s)) return 'form';
    return 'doc';
  }

  function renderContext(ex) {
    var leadArr = Array.isArray(ex.lead) ? ex.lead : [ex.lead];
    var lead = leadArr.filter(Boolean).map(function (p) {
      return '<p class="gp-lead">' + esc(p) + '</p>';
    }).join('');
    function fact(label, value, cls) {
      // Each card type gets its own paper-craft accent via a modifier class.
      var mod = '';
      if (/problem/i.test(label)) mod = ' gp-fact--problem';
      else if (/how/i.test(label)) mod = ' gp-fact--how';
      else if (/included|guide/i.test(label)) mod = ' gp-fact--included';
      return '<div class="gp-fact context-card' + mod + '"><dt>' + label + '</dt>' +
        '<dd' + (cls ? ' class="' + cls + '"' : '') + '>' + value + '</dd></div>';
    }
    // Role lists its files as visual tiles in the preview; the customer panel
    // keeps a compact "in the guide" pill list here so the two read differently.
    var insideFact = '';
    if (ex.built && ex.built.length) {
      insideFact = fact('What\'s included',
        '<ul class="gp-pills">' + ex.built.map(function (b) {
          return '<li>' + esc(b) + '</li>';
        }).join('') + '</ul>');
    }
    return '<span class="gp-category">' + esc(ex.category) + '</span>' +
      '<h3 class="gp-title">' + esc(ex.title) + '</h3>' +
      lead +
      '<dl class="gp-facts">' +
        fact('Problem', esc(ex.problem)) +
        fact('How it works', esc(ex.howItWorks)) +
        insideFact +
        (ex.result ? fact('Result', esc(ex.result)) : '') +
      '</dl>';
  }

  function renderTiles(ex) {
    return (ex.built || []).map(function (b) {
      return '<li class="gp-tile gp-tile--' + tileType(b) + '">' +
        '<span class="gp-tile-ic" aria-hidden="true"></span>' +
        '<span class="gp-tile-l">' + esc(b) + '</span></li>';
    }).join('');
  }

  function renderShot(ex) {
    return '<img class="gp-shot" src="' + esc(ex.image) + '" loading="lazy" decoding="async" alt="' + esc(ex.imageAlt) + '" />';
  }
  function renderCap(ex) {
    return ex.caption ? '<figcaption class="gp-frame-cap">' + esc(ex.caption) + '</figcaption>' : '';
  }

  function renderPreview(ex) {
    if (!ex.image) {
      return '<figure class="gp-frame gp-frame--placeholder">' +
        '<div class="gp-screen"><div class="gp-window">' +
        '<div class="gp-empty">' +
        '<span class="gp-empty-label">Sample coming soon</span>' +
        '<span class="gp-empty-sub">' + esc(ex.title) + '</span>' +
        '</div></div></div></figure>';
    }
    // Role: Drive-folder window + a strip of file tiles below.
    return '<figure class="gp-frame gp-frame--drive">' +
      '<div class="gp-screen">' +
        '<div class="gp-chrome gp-chrome--drive" aria-hidden="true">' +
          '<span class="gp-chrome-dots"><i></i><i></i><i></i></span>' +
        '</div>' +
        '<div class="gp-window">' + renderShot(ex) + '</div>' +
      '</div>' +
      renderCap(ex) +
      '</figure>';
  }

  function animateIn(el) {
    if (prefersReduced) return;
    el.classList.remove('gp-swap-in');
    void el.offsetWidth; // force reflow so the animation re-triggers
    el.classList.add('gp-swap-in');
  }

  // Wire each section's tabs independently
  sections.forEach(function (section) {
    var contextEl = section.querySelector('.gp-context');
    var previewEl = section.querySelector('.gp-preview');
    var rail = section.querySelector('.gp-rail');
    if (!contextEl || !previewEl || !rail) return;

    var items = Array.prototype.slice.call(rail.querySelectorAll('.gp-rail-item'));
    if (!items.length) return;

    function select(id, focusBtn) {
      var ex = EXAMPLES[id];
      if (!ex) return;
      contextEl.innerHTML = renderContext(ex);
      previewEl.innerHTML = renderPreview(ex);
      animateIn(contextEl);
      animateIn(previewEl);
      items.forEach(function (btn) {
        var on = btn.getAttribute('data-example') === id;
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
        btn.tabIndex = on ? 0 : -1;
        if (on && focusBtn) btn.focus();
      });
    }

    items.forEach(function (btn, idx) {
      btn.addEventListener('click', function () {
        select(btn.getAttribute('data-example'));
      });
      // Roving-tabindex arrow navigation for the tablist
      btn.addEventListener('keydown', function (e) {
        var dir = 0;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') dir = 1;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') dir = -1;
        else if (e.key === 'Home') dir = -idx;
        else if (e.key === 'End') dir = items.length - 1 - idx;
        else return;
        e.preventDefault();
        var next = (idx + dir + items.length) % items.length;
        select(items[next].getAttribute('data-example'), true);
      });
    });

    // On phones each example section collapses to a single example (the tab
    // selector is hidden via CSS). Above the breakpoint it returns to the
    // desktop default. Keyed by section id: { mobile, desktop } example ids.
    var MOBILE_ONLY = {
      'guide-projects': { mobile: 'role-01', desktop: 'role-01' }
    };
    var collapseCfg = MOBILE_ONLY[section.id];
    if (collapseCfg && window.matchMedia) {
      var mq = window.matchMedia('(max-width: 640px)');
      if (mq.matches) select(collapseCfg.mobile);
      var onMobileChange = function () {
        select(mq.matches ? collapseCfg.mobile : collapseCfg.desktop);
      };
      if (mq.addEventListener) mq.addEventListener('change', onMobileChange);
      else if (mq.addListener) mq.addListener(onMobileChange);
    }
  });
});


// ─── Customer Guides: editorial showcase selector ───────────
// The Customer Guides section (#customer-guides) is its own poster layout:
// a vertical example rail on the left and a large laptop deliverable with
// floating note cards on the right. The Student Robot example is rendered
// statically so it works without JS; this swaps the preview device + the
// note-card content (problem / how it works / in the guide / result) when
// another example is selected. The shared .gp-section switcher above skips
// this section because it has no .gp-context / .gp-preview / .gp-rail.
document.addEventListener('DOMContentLoaded', function () {
  var section = document.getElementById('customer-guides');
  if (!section) return;

  var rail = section.querySelector('.cg-rail');
  var deviceEl = document.getElementById('cg-device');
  var problemEl = document.getElementById('cg-problem');
  var guideEl = document.getElementById('cg-guide');
  var resultEl = document.getElementById('cg-result');
  if (!rail || !deviceEl) return;

  var prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var CG = {
    'cust-03': {
      device: 'laptop',
      img: 'images/customer-guides/customer-robot-laptop-guide.webp',
      alt: 'The Student Robot Build Guide opened on a laptop — a sidebar with Start Here, Parts, Build Steps, Wiring, Code, Testing, Troubleshooting, and Help, plus parts and simple wiring diagrams.',
      problem: 'Students need one place to follow the build instead of piecing together instructions from slides, videos, verbal explanations, and notes.',
      guide: ['Start here', 'Build steps', 'Parts + wiring', 'Code + testing', 'Troubleshooting help'],
      result: 'Students can build, wire, code, and test the robot from one clear guide.'
    },
    'cust-02': {
      device: 'tablet',
      img: 'images/customer-guides/customer-workshop-tablet-guide.webp',
      alt: 'The finished Business Workshop Guide opened on a tablet — a sidebar with Start Here, Workshop Schedule, What to Bring, Preparation Steps, Business Checklist, Common Questions, and Contact / Help.',
      card: {
        img: 'images/customer-guides/customer-workshop-form-card.webp',
        label: 'Confirmation',
        alt: 'Registration confirmation for the Coastal Business Workshop — "Here\'s your guide" with an Open Attendee Guide button and a link to the workshop guide.'
      },
      problem: 'Attendees often miss important details when event information is scattered across emails, messages, and PDFs.',
      guide: ['Start here', 'Schedule + what to bring', 'Preparation steps', 'Checklist + help'],
      result: 'Attendees arrive prepared with one guide for the workshop instead of digging through scattered messages.'
    },
    'cust-01': {
      device: 'phone',
      img: 'images/customer-guides/customer-beach-mobile-guide.webp',
      alt: 'The mobile guest guide opened on a phone — a Welcome screen with Start Here check-in and an expandable guide covering Wi-Fi, house basics, local recommendations, checkout steps, and host contact.',
      card: {
        img: 'images/customer-guides/customer-beach-qr-card.webp',
        label: 'Printout Card',
        alt: 'Printed QR welcome card for The Dune House beachside rental — "Scan to open your guest guide" with a QR code and an overview of what the guide includes.'
      },
      problem: 'Guests often text the host for the same details: Wi-Fi, parking, house instructions, local recommendations, and checkout steps.',
      guide: ['Check-in details', 'House basics', 'Wi-Fi info', 'Local picks', 'Checkout + help'],
      result: 'Guests get quick answers from one polished guide, and the host answers fewer repeat questions.'
    }
  };

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function deviceFrame(ex) {
    var img = '<img id="cg-device-img" src="' + esc(ex.img) + '" loading="lazy" decoding="async" alt="' + esc(ex.alt) + '" />';
    if (ex.device === 'laptop') {
      return '<div class="gp-laptop">' +
        '<div class="gp-laptop-lid"><div class="gp-laptop-screen">' + img + '</div></div>' +
        '<div class="gp-laptop-base"></div>' +
        '</div>';
    }
    return '<div class="gp-' + ex.device + '"><div class="gp-' + ex.device + '-screen">' + img + '</div></div>';
  }

  // The deliverable stage: an optional flat delivery card (confirmation /
  // printout) beside the guide on its device frame, each with a small label.
  function buildDevice(ex) {
    var solo = ex.card ? '' : ' gp-frame--solo';
    var cardCol = ex.card
      ? '<div class="gp-deliv gp-deliv--card">' +
          '<figure class="gp-card"><img src="' + esc(ex.card.img) + '" loading="lazy" decoding="async" alt="' + esc(ex.card.alt) + '" /></figure>' +
        '</div>'
      : '';
    return '<figure class="gp-frame gp-frame--deliv gp-frame--' + ex.device + solo + '">' +
      '<div class="gp-stage">' +
        cardCol +
        '<div class="gp-deliv gp-deliv--' + ex.device + '">' +
          deviceFrame(ex) +
        '</div>' +
      '</div>' +
    '</figure>';
  }

  function animateIn(el) {
    if (prefersReduced || !el) return;
    el.classList.remove('cg-swap-in');
    void el.offsetWidth;
    el.classList.add('cg-swap-in');
  }

  var items = Array.prototype.slice.call(rail.querySelectorAll('.cg-tab'));
  if (!items.length) return;

  function select(id, focusBtn) {
    var ex = CG[id];
    if (!ex) return;

    deviceEl.innerHTML = buildDevice(ex);
    if (problemEl) problemEl.textContent = ex.problem;
    if (resultEl) resultEl.textContent = ex.result;
    if (guideEl && ex.guide) {
      guideEl.innerHTML = ex.guide.map(function (g) {
        return '<li class="cg-guide-item">' + esc(g) + '</li>';
      }).join('');
    }

    animateIn(deviceEl);
    animateIn(document.getElementById('cg-aside'));

    items.forEach(function (btn) {
      var on = btn.getAttribute('data-example') === id;
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
      btn.tabIndex = on ? 0 : -1;
      if (on && focusBtn) btn.focus();
    });
  }

  items.forEach(function (btn, idx) {
    btn.addEventListener('click', function () {
      select(btn.getAttribute('data-example'));
    });
    btn.addEventListener('keydown', function (e) {
      var dir = 0;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') dir = 1;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') dir = -1;
      else if (e.key === 'Home') dir = -idx;
      else if (e.key === 'End') dir = items.length - 1 - idx;
      else return;
      e.preventDefault();
      var next = (idx + dir + items.length) % items.length;
      select(items[next].getAttribute('data-example'), true);
    });
  });
});


// ─── Morpheus proof: loop the source videos only while the section is on screen ─
// Muted + playsinline so they can autoplay without a user gesture; an
// IntersectionObserver starts them when #project scrolls into view and pauses
// them when it leaves. No controls, no hover required.
document.addEventListener('DOMContentLoaded', function () {
  var section = document.getElementById('project');
  if (!section) return;

  var vids = Array.prototype.slice.call(section.querySelectorAll('video.rpp-video'));
  if (!vids.length) return;

  // Required for gesture-free autoplay.
  vids.forEach(function (v) { v.muted = true; });

  function playAll() {
    vids.forEach(function (v) {
      var p = v.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    });
  }
  function pauseAll() {
    vids.forEach(function (v) { v.pause(); });
  }

  // Respect reduced motion: leave the first frame visible, don't loop.
  var prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  if (!('IntersectionObserver' in window)) { playAll(); return; }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) playAll();
      else pauseAll();
    });
  }, { threshold: 0.2 });
  io.observe(section);
});


// ─── Proof-board image lightbox (click-to-expand full-size) ──────
document.addEventListener('DOMContentLoaded', function () {
  var box = document.getElementById('rpp-lightbox');
  var boxImg = document.getElementById('rpp-lightbox-img');
  var boxCap = document.getElementById('rpp-lightbox-cap');
  if (!box || !boxImg || !boxCap) return;

  var lastTrigger = null;

  function open(src, label) {
    boxImg.setAttribute('src', src);
    boxImg.setAttribute('alt', label || '');
    boxCap.textContent = label || '';
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    var closeBtn = box.querySelector('[data-rpp-close]');
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    box.hidden = true;
    boxImg.setAttribute('src', '');
    document.body.style.overflow = '';
    if (lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
  }

  document.querySelectorAll('[data-rpp-zoom]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      lastTrigger = btn;
      var img = btn.querySelector('.rpp-img');
      open(btn.getAttribute('data-full'), img ? img.getAttribute('alt') : '');
    });
  });

  // Close on the close button, on backdrop click, and on Escape.
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.closest('[data-rpp-close]')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (!box.hidden && (e.key === 'Escape' || e.key === 'Esc')) close();
  });
});
