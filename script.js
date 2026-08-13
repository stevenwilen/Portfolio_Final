

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
  var guideEl = document.getElementById('cg-guide');
  var resultEl = document.getElementById('cg-result');
  if (!rail || !deviceEl) return;

  var prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var CG = {
    'cust-04': {
      device: 'phone',
      img: 'images/customer-guides/customer-openhouse-mobile-guide.webp',
      alt: 'The open house guide for 214 Larkspur Lane opened on a phone - the address, price, beds, baths and square footage over a photo of the porch, with the agent’s name and a call button.',
      guide: ['The home + photo gallery', 'What’s included', 'Neighborhood + schools', 'HOA / CDD fees', 'Agent contact'],
      result: 'The listing goes home in the buyer’s pocket instead of the recycling, with the agent’s number attached to it.'
    },
    'cust-03': {
      device: 'laptop',
      img: 'images/customer-guides/customer-robot-laptop-guide.webp',
      alt: 'The Student Robot Build Guide opened on a laptop - a sidebar with Start Here, Parts, Build Steps, Wiring, Code, Testing, Troubleshooting, and Help, plus parts and simple wiring diagrams.',
      guide: ['Start here', 'Build steps', 'Parts + wiring', 'Code + testing', 'Troubleshooting help'],
      result: 'Students can build, wire, code, and test the robot from one clear guide.'
    },
    'cust-02': {
      device: 'tablet',
      img: 'images/customer-guides/customer-workshop-tablet-guide.webp',
      alt: 'The finished Business Workshop Guide opened on a tablet - a sidebar with Start Here, Workshop Schedule, What to Bring, Preparation Steps, Business Checklist, Common Questions, and Contact / Help.',
      card: {
        img: 'images/customer-guides/customer-workshop-form-card.webp',
        label: 'Confirmation',
        alt: 'Registration confirmation for the Coastal Business Workshop - "Here\'s your guide" with an Open Attendee Guide button and a link to the workshop guide.'
      },
      guide: ['Start here', 'Schedule + what to bring', 'Preparation steps', 'Checklist + help'],
      result: 'Attendees arrive prepared with one guide for the workshop instead of digging through scattered messages.'
    },
    'cust-01': {
      device: 'phone',
      img: 'images/customer-guides/customer-beach-mobile-guide.webp',
      alt: 'The mobile guest guide opened on a phone - a Welcome screen with Start Here check-in and an expandable guide covering Wi-Fi, house basics, local recommendations, checkout steps, and host contact.',
      card: {
        img: 'images/customer-guides/customer-beach-qr-card.webp',
        label: 'Printout Card',
        alt: 'Printed QR welcome card for The Dune House beachside rental - "Scan to open your guest guide" with a QR code and an overview of what the guide includes.'
      },
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

  // Warm the browser cache for every tab's images so switching tabs shows the
  // deliverable instantly instead of fetching (and briefly blanking) on click.
  // Done on idle so it never competes with the initial page load.
  function preloadCG() {
    Object.keys(CG).forEach(function (id) {
      var ex = CG[id];
      [ex.img, ex.card && ex.card.img].forEach(function (src) {
        if (src) { var im = new Image(); im.decoding = 'async'; im.src = src; }
      });
    });
  }
  if ('requestIdleCallback' in window) requestIdleCallback(preloadCG, { timeout: 1500 });
  else setTimeout(preloadCG, 600);
});

