

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
    // ── Role & Task Instructions ──
    'role-01': {
      category: 'Role or task instructions',
      title: 'Front Desk Opening Handoff System',
      lead: 'A sample Drive package for a small fitness studio\'s opening shift.',
      problem: 'The shift relied on verbal instructions and memory instead of a clear handoff process staff could follow consistently.',
      howItWorks: 'Staff follow the guide and checklist, submit the completion form, and report issues when needed. Form responses feed into the manager tracker automatically.',
      built: ['Guide', 'Checklist', 'Completion Form', 'Issue Report Form', 'Manager Tracker', 'Cheat Sheet', 'QR Access'],
      image: 'images/deliverable-role.png',
      imageAlt: 'Google Drive package for the Front Desk Opening Handoff System — folder containing a Start Here Guide, Opening Checklist, Completion Form, Issue Report Form, Manager Tracker, printable cheat sheet, and a QR / mobile access card.',
      caption: 'Front Desk Opening Handoff System · Google Drive package'
    },
    'role-02': {
      category: 'Role or task instructions',
      title: 'Event Volunteer Role Guide',
      lead: 'A mobile-friendly guide system for volunteers working a local event.',
      problem: 'Volunteers were receiving scattered instructions through emails, texts, and day-of explanations, which made it hard to know where to go and what each role was responsible for.',
      howItWorks: 'Volunteers scan a QR code or open the guide before the event, choose their assigned role, and follow clear role instructions, station details, timeline notes, and escalation steps.',
      built: ['Volunteer Guide', 'Role Cards', 'Station Sheets', 'Event Timeline', 'Contact List', 'Day-Of Cheat Sheet', 'QR Access']
    },
    'role-03': {
      category: 'Role or task instructions',
      title: 'Intern Training Guide',
      lead: 'A structured training guide for a recurring intern responsibility.',
      problem: 'New interns needed repeated explanations before they could complete the same task confidently.',
      howItWorks: 'The guide breaks the task into clear steps, shows examples, includes screenshots where needed, and gives interns a checklist to confirm completion before asking for review.',
      built: ['Training Guide', 'Step-by-Step Instructions', 'Screenshots', 'Examples', 'Completion Checklist', 'Review Notes']
    },
    // ── Customer Guides ──
    'cust-01': {
      category: 'Customer guide',
      title: 'QR Guest Guide for a Beachside Rental',
      lead: 'A sample mobile guide guests open from a QR code inside a vacation rental.',
      problem: 'Guests often text the host for the same basic details: Wi-Fi, parking, house instructions, local recommendations, and checkout steps.',
      howItWorks: 'A QR card sits inside the rental. Guests scan it and open a polished guide with the most important stay information in one place.',
      built: ['QR Welcome Card', 'Mobile Guest Guide', 'Wi-Fi Info', 'Check-In Details', 'House Basics', 'Local Picks', 'Checkout Checklist', 'Host Contact'],
      image: 'images/deliverable-web-guide.png',
      imageAlt: 'Mobile guest guide for a beachside vacation rental, opened from a QR code — one clean page with Wi-Fi info, check-in details, house basics, local recommendations, a checkout checklist, and host contact.',
      caption: 'QR Guest Guide for a Beachside Rental · Mobile guest guide'
    },
    'cust-02': {
      category: 'Customer guide',
      title: 'Fitness Studio New Member Guide',
      lead: 'A start guide for new members joining a boutique fitness studio.',
      problem: 'New members often feel unsure before their first class and ask the same questions about what to bring, where to check in, how booking works, and what studio rules to follow.',
      howItWorks: 'The studio sends one guide link after signup and can also display it with a QR code at the front desk. Members get clear first-visit instructions and answers before they need to ask.',
      built: ['Welcome Guide', 'First Class Checklist', 'Booking Instructions', 'Studio Rules', 'What to Bring', 'FAQs', 'Contact Info']
    },
    'cust-03': {
      category: 'Customer guide',
      title: 'Equipment Rental Use Guide',
      lead: 'A QR-accessible guide attached to a rented piece of equipment.',
      problem: 'Customers rent equipment but often need help understanding setup, safe use, common mistakes, troubleshooting, and return steps.',
      howItWorks: 'A QR code on the equipment opens a simple mobile guide with setup steps, safety notes, troubleshooting, and return instructions.',
      built: ['QR Equipment Label', 'Setup Guide', 'Safety Notes', 'Common Mistakes', 'Troubleshooting', 'Return Checklist', 'Support Contact']
    }
  };

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function renderContext(ex) {
    var builtInline = (ex.built || []).map(esc).join(' · ');
    var leadArr = Array.isArray(ex.lead) ? ex.lead : [ex.lead];
    var lead = leadArr.filter(Boolean).map(function (p) {
      return '<p class="gp-lead">' + esc(p) + '</p>';
    }).join('');
    function fact(label, value, cls) {
      return '<div class="gp-fact"><dt>' + label + '</dt>' +
        '<dd' + (cls ? ' class="' + cls + '"' : '') + '>' + value + '</dd></div>';
    }
    return '<span class="gp-category">' + esc(ex.category) + '</span>' +
      '<h3 class="gp-title">' + esc(ex.title) + '</h3>' +
      lead +
      '<dl class="gp-facts">' +
        fact('Problem', esc(ex.problem)) +
        fact('How it works', esc(ex.howItWorks)) +
        fact('Built', builtInline, 'gp-built-inline') +
        (ex.result ? fact('Result', esc(ex.result)) : '') +
      '</dl>';
  }

  function renderPreview(ex) {
    if (!ex.image) {
      return '<figure class="gp-frame gp-frame--placeholder">' +
        '<div class="gp-window">' +
        '<div class="gp-empty">' +
        '<span class="gp-empty-label">Sample coming soon</span>' +
        '<span class="gp-empty-sub">' + esc(ex.title) + '</span>' +
        '</div></div></figure>';
    }
    return '<figure class="gp-frame">' +
      '<div class="gp-window">' +
      '<img class="gp-shot" src="' + esc(ex.image) + '" loading="lazy" decoding="async" alt="' + esc(ex.imageAlt) + '" />' +
      '</div>' +
      (ex.caption ? '<figcaption class="gp-frame-cap">' + esc(ex.caption) + '</figcaption>' : '') +
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
  });
});
