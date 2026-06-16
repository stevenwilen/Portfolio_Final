

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
      lead: 'A sample Drive package for a small fitness studio\'s opening shift.',
      problem: 'The shift relied on verbal instructions and memory instead of a clear handoff process staff could follow consistently.',
      howItWorks: 'Staff follow the guide and checklist, submit the completion form, and report issues when needed. Form responses feed into the manager tracker automatically.',
      built: ['Checklist', 'Completion Form', 'Issue Report Form', 'Manager Tracker', 'Cheat Sheet', 'QR Access'],
      image: 'images/deliverable-role.png',
      imageAlt: 'Google Drive package for the Front Desk Opening Handoff System — folder containing a Start Here Guide, Opening Checklist, Completion Form, Issue Report Form, Manager Tracker, printable cheat sheet, and a QR / mobile access card.',
      caption: 'Front Desk Opening Handoff System · Google Drive package'
    },
    'role-02': {
      kind: 'role',
      category: 'For new hires',
      title: 'New Staff Training Guide',
      folder: 'New Staff Training',
      lead: 'A sample starter package for a small business training a new part-time employee.',
      problem: 'New staff kept asking the same basic questions because training lived in quick verbal explanations, scattered notes, and old messages.',
      howItWorks: 'The new hire gets one clear place to start: what to learn first, what tools to use, what tasks to practice, and who to ask when something is unclear.',
      built: ['Start Here Guide', 'First Week Checklist', 'Tool Walkthrough', 'Common Questions', 'Daily Task Reference', 'Manager Notes', 'Editable Training Doc'],
      image: 'images/deliverable-role-2.png',
      imageAlt: 'New Staff Training Guide package — a Start Here guide, first-week checklist, tool walkthrough, common questions, daily task reference, manager notes, and an editable training doc.',
      caption: 'New Staff Training Guide · Sample starter package'
    },
    'role-03': {
      kind: 'role',
      category: 'For volunteers',
      title: 'Event Day Role Guide',
      folder: 'Event Day Roles',
      lead: 'A sample role package for volunteers helping run a local event.',
      problem: 'Volunteers showed up unsure where to go, what role they had, who to ask, and what to do when something changed during the event.',
      howItWorks: 'Each volunteer gets a clear role guide with arrival instructions, responsibilities, a simple event map, contact info, and a checklist for their specific station.',
      built: ['Volunteer Guide', 'Role Checklists', 'Arrival Instructions', 'Event Map', 'Contact Sheet', 'Issue Form', 'QR Access'],
      image: 'images/deliverable-role-3.png',
      imageAlt: 'Event Day Role Guide package — a volunteer guide, role checklists, arrival instructions, an event map, a contact sheet, an issue form, and QR access.',
      caption: 'Event Day Role Guide · Sample role package'
    },
    // ── Customer Guides (QR / web guides) ──
    'cust-01': {
      kind: 'cust',
      category: 'For guests',
      title: 'QR Guest Guide for a Beachside Rental',
      url: 'guides.site/beach-rental',
      lead: 'A sample mobile guide guests open from a QR code inside a vacation rental.',
      problem: 'Guests often text the host for the same basic details: Wi-Fi, parking, house instructions, local recommendations, and checkout steps.',
      howItWorks: 'A QR card sits inside the rental. Guests scan it and open a polished guide with the most important stay information in one place.',
      built: ['Wi-Fi Info', 'Check-In Details', 'House Basics', 'Local Picks', 'Checkout Checklist', 'Host Contact'],
      image: 'images/beach-rental-guide-screen.png',
      deliverable: {
        bg: 'images/beach-rental-background.jpg',
        card: {
          img: 'images/beach-rental-qr-card.png',
          label: 'Printout Card',
          alt: 'Printed QR welcome card for The Dune House beachside rental — "Scan to open your guest guide" with a QR code and an overview of what the guide includes.'
        },
        device: {
          type: 'phone',
          img: 'images/beach-rental-guide-screen.png',
          label: 'Web Guide',
          alt: 'The mobile guest guide opened on a phone — a Welcome screen with Start Here check-in and an expandable guide covering Wi-Fi, house basics, local recommendations, checkout steps, and host contact.'
        }
      },
      caption: 'QR Guest Guide for a Beachside Rental · Scan the card, open the mobile guide'
    },
    'cust-02': {
      kind: 'cust',
      category: 'For attendees',
      title: 'Business Workshop Guide',
      url: 'guides.site/workshop',
      lead: 'A sample web guide attendees open on a tablet after registering for a workshop.',
      problem: 'Attendees often get event details through long emails, scattered messages, or basic PDFs that are easy to miss.',
      howItWorks: 'A business owner submits a short intake form and is sent a polished guide — opened on any device — with the schedule, what to bring, preparation steps, and a checklist.',
      built: ['Workshop Schedule', 'What to Bring', 'Preparation Steps', 'Business Checklist', 'Common Questions', 'Contact / Help'],
      image: 'images/business-workshop-tablet-screen.png',
      deliverable: {
        bg: 'images/business-workshop-background.png',
        card: {
          img: 'images/business-workshop-form-card.png',
          label: 'Confirmation',
          alt: 'Registration confirmation for the Coastal Business Workshop — "Here\'s your guide" with an Open Attendee Guide button and a link to the workshop guide.'
        },
        device: {
          type: 'tablet',
          img: 'images/business-workshop-tablet-screen.png',
          label: 'Web Guide',
          alt: 'The finished Business Workshop Guide opened on a tablet — a sidebar with Start Here, Workshop Schedule, What to Bring, Preparation Steps, Business Checklist, Common Questions, and Contact / Help.'
        }
      },
      caption: 'Business Workshop Guide · Register, then open the guide on a tablet'
    },
    'cust-03': {
      kind: 'cust',
      category: 'For students',
      title: 'Robotics Workshop Guide',
      url: 'guides.site/robotics',
      lead: 'A sample online guide students open before and during a hands-on robotics workshop.',
      problem: 'Students and parents often get workshop details through long emails or PDFs, making it hard to find the schedule, materials, and project steps when they need them.',
      howItWorks: 'After registering, students receive a link to a polished guide with the schedule, what to bring, project overview, step-by-step instructions, and support details.',
      built: ['Schedule', 'Project Overview', 'Materials List', 'Step-by-Step', 'Safety Notes', 'Contact Info'],
      image: 'images/deliverable-web-guide-3.png',
      imageAlt: 'Robotics Workshop Guide — a sample online learning guide students open after registering, with the schedule, project overview, materials list, step-by-step instructions, safety notes, and contact info.',
      caption: 'Robotics Workshop Guide · Sample student learning guide'
    }
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
      return '<div class="gp-fact"><dt>' + label + '</dt>' +
        '<dd' + (cls ? ' class="' + cls + '"' : '') + '>' + value + '</dd></div>';
    }
    // Role lists its files as visual tiles in the preview; the customer panel
    // keeps a compact "in the guide" pill list here so the two read differently.
    var insideFact = '';
    if (ex.built && ex.built.length) {
      insideFact = fact('In the guide',
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

  // Deliverable presentation: a flat delivery card (left) + the guide on a
  // device frame (right, phone or tablet), over a faded in-context backdrop.
  function renderDeliverable(ex) {
    var d = ex.deliverable;
    var dev = d.device || {};
    var devType = dev.type === 'tablet' ? 'tablet' : 'phone';
    function label(t) {
      return t ? '<span class="gp-deliv-label">' + esc(t) + '</span>' : '';
    }
    var bgStyle = d.bg ? " style=\"--gp-deliv-bg:url('" + d.bg + "')\"" : '';
    return '<figure class="gp-frame gp-frame--web gp-frame--deliv gp-frame--' + devType + '"' + bgStyle + '>' +
      '<div class="gp-stage">' +
        '<div class="gp-deliv gp-deliv--card">' +
          label(d.card && d.card.label) +
          '<figure class="gp-card">' +
            '<img src="' + esc(d.card.img) + '" loading="lazy" decoding="async" alt="' + esc((d.card && d.card.alt) || '') + '" />' +
          '</figure>' +
        '</div>' +
        '<div class="gp-deliv gp-deliv--' + devType + '">' +
          label(dev.label) +
          '<div class="gp-' + devType + '">' +
            '<div class="gp-' + devType + '-screen">' +
              '<img src="' + esc(dev.img) + '" loading="lazy" decoding="async" alt="' + esc(dev.alt || '') + '" />' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      renderCap(ex) +
      '</figure>';
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
    if (ex.kind === 'cust') {
      // Two artifacts (a delivery card + the live guide on a device) are
      // presented as real deliverables on a faded, in-context background —
      // no browser chrome. The device is a phone or a landscape tablet.
      if (ex.deliverable) {
        return renderDeliverable(ex);
      }
      // Flat web-guide screenshot → shown in a simple browser window.
      return '<figure class="gp-frame gp-frame--web">' +
        '<div class="gp-screen">' +
          '<div class="gp-chrome gp-chrome--web" aria-hidden="true">' +
            '<span class="gp-chrome-dots"><i></i><i></i><i></i></span>' +
            '<span class="gp-url"><span class="gp-url-lock"></span>' + esc(ex.url || 'guides.site') + '</span>' +
            '<span class="gp-chrome-spacer"></span>' +
          '</div>' +
          '<div class="gp-window">' + renderShot(ex) + '</div>' +
        '</div>' +
        renderCap(ex) +
        '</figure>';
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
