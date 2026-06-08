

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
