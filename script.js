document.addEventListener('DOMContentLoaded', function () {

  // ─── Dummy course mockup ──────────────────────────────────────

  var navItems      = document.querySelectorAll('#dummy-course-mockup .mockup-lesson');
  var lessonEl      = document.getElementById('mockup-lesson');
  var nextSlot      = document.getElementById('mockup-next-slot');
  var progressFill  = document.getElementById('mockup-progress-fill');
  var progressLabel = document.getElementById('mockup-progress-label');

  if (!navItems.length || !lessonEl) return;

  // Nav items appear in document order — lesson data must match exactly.
  var lessons = [

    // ── Overview ──────────────────────────────────────────────

    {
      title: 'Overview',
      layout: 'overview',
      body: [
        'This course takes you from zero familiarity to confident use of the platform across all core workflows. It\'s structured so each lesson builds on the last — start to finish, no skipping required.'
      ],
      time: '~90 minutes',
      outcomes: [
        'Navigate the platform and understand how its core areas connect',
        'Create, assign, and move records through a pipeline',
        'Configure automations and condition-based rules',
        'Connect external tools via integrations',
        'Recognize the most common team workflow patterns'
      ]
    },

    // ── Module 1 ──────────────────────────────────────────────

    {
      title: 'Introduction to the Platform',
      layout: 'written-hub',
      body: [
        'Welcome to the Product Certification Program. This course takes you from zero familiarity to confident, certified use of the platform — at your own pace, with clear checkpoints along the way.',
        'The platform is organized around four interconnected areas. Understanding how they relate to each other is the foundation for everything that follows.'
      ],
      diagramHeading: 'Platform at a glance',
      diagramCenter: 'Platform',
      diagramNodes: ['Users', 'Data', 'Reports', 'Integrations']
    },

    {
      title: 'Key Concepts and Terminology',
      layout: 'written-glossary',
      body: [
        'Before diving into features, it helps to understand the specific terms the platform uses. These aren\'t generic industry labels — they have precise meanings inside this system.'
      ],
      terms: [
        { term: 'Workspace',    def: 'Your organization\'s dedicated environment. All users, data, and settings live inside a single workspace.' },
        { term: 'Role',         def: 'A permission level assigned to a user. Roles control what a user can view, create, or modify.' },
        { term: 'Pipeline',     def: 'An automated sequence of actions triggered by a defined event or schedule.' },
        { term: 'Record',       def: 'A single data entry — a customer, a task, a transaction. The core unit of information in the platform.' },
        { term: 'Integration',  def: 'A live connection to an external tool. Data flows both ways.' },
        { term: 'Report',       def: 'A saved view that filters and surfaces records according to criteria you define.' }
      ]
    },

    // ── Module 2 ──────────────────────────────────────────────

    {
      title: 'Core Features Overview',
      layout: 'written-video-flow',
      body: [
        'This lesson walks through the platform\'s core features — the tools your team will use every day. By the end, you\'ll be able to navigate confidently, understand the primary workflows, and know where to find what you need.'
      ],
      videoLabel: 'Watch: Core Features Overview',
      diagramHeading: 'How the workflow connects',
      diagramNodes: ['Intake', 'Review', 'Build', 'Publish']
    },

    {
      title: 'Hands-On Walkthrough',
      layout: 'written-video',
      body: [
        'This lesson is a guided walkthrough of the most common daily tasks. Follow along with the video — it covers creating a record, assigning ownership, attaching it to a pipeline, and pushing it to completion.',
        'Use the steps below as a reference when you\'re working on your own. The full loop from intake to resolution takes under three minutes once you\'ve done it a few times.'
      ],
      videoLabel: 'Watch: Hands-On Walkthrough'
    },

    {
      title: 'Common Use Patterns',
      layout: 'written-usecases',
      body: [
        'The platform is flexible enough to support a wide range of team structures. These three patterns cover the majority of how teams put it into practice.'
      ],
      useCases: [
        {
          title: 'Intake and triage',
          desc: 'New records arrive via form, email, or API. A pipeline routes them to the right owner automatically. Nothing falls through the cracks.'
        },
        {
          title: 'Collaborative review',
          desc: 'Multiple team members work on a record in sequence. Each handoff is tracked, timestamped, and visible to everyone with access.'
        },
        {
          title: 'Reporting and close',
          desc: 'At the end of each cycle, a report pulls all completed records by owner and outcome. One click to export for leadership.'
        }
      ]
    },

    // ── Module 3 ──────────────────────────────────────────────

    {
      title: 'Advanced Configuration',
      layout: 'written-decision',
      body: [
        'Once you\'ve mastered the core workflow, the platform opens up a layer of configuration that lets you adapt it precisely to your team\'s process — without needing engineering support.',
        'Every pipeline follows the same decision path. Define your trigger, determine whether a condition is needed, set the action, and activate.'
      ],
      diagramHeading: 'Pipeline configuration path',
      diagramNodes: ['Define trigger', 'Needs condition?', 'Add filter rule', 'Set action', 'Activate']
    },

    {
      title: 'Integration Scenarios',
      layout: 'written-hub',
      body: [
        'The platform connects to the tools your team already uses. Integrations are bidirectional — data flows in when something happens in an external system, and flows out when the platform takes an action.',
        'Each integration is configured once and runs automatically from that point forward. The most commonly connected systems are shown below.'
      ],
      diagramHeading: 'Connected systems',
      diagramCenter: 'Platform',
      diagramNodes: ['CRM', 'Messaging', 'Calendar', 'Data warehouse']
    },

    // ── Module 4 ──────────────────────────────────────────────

    {
      title: 'Practice Questions',
      layout: 'quiz',
      body: [
        'These questions cover the core concepts from all three modules. Work through them to confirm what you\'ve learned — there\'s no score, no timer, and no pressure. Just a checkpoint to make sure everything landed.'
      ],
      questions: [
        {
          q: 'What is the core unit of information stored in the platform?',
          options: ['Pipeline', 'Role', 'Record', 'Workspace'],
          correct: 2
        },
        {
          q: 'Which component controls what a user can view or modify?',
          options: ['Integration', 'Role', 'Report', 'Pipeline'],
          correct: 1
        },
        {
          q: 'What does a pipeline automate?',
          options: [
            'User account creation only',
            'A sequence of actions triggered by a defined event',
            'Report generation only',
            'External data imports only'
          ],
          correct: 1
        },
        {
          q: 'Integrations in this platform are:',
          options: ['One-way inbound only', 'One-way outbound only', 'Bidirectional', 'Manual only'],
          correct: 2
        }
      ]
    },

  ];

  var currentIndex = 0;

  // ── Render helpers ────────────────────────────────────────────

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderVideo(lesson) {
    return '<div class="mc-video">' +
      '<div class="mc-video-player">' +
        '<div class="mc-play-btn" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' +
        '</div>' +
      '</div>' +
      '<p class="mc-video-label">' + esc(lesson.videoLabel) + '</p>' +
    '</div>';
  }

  function renderFlowDiagram(lesson) {
    var html = '<h3 class="mc-diagram-heading">' + esc(lesson.diagramHeading) + '</h3>';
    html += '<div class="mc-flow">';
    lesson.diagramNodes.forEach(function (node, i) {
      var last = i === lesson.diagramNodes.length - 1;
      html += '<div class="mc-step-box' + (last ? ' mc-step-box--accent' : '') + '">' + esc(node) + '</div>';
      if (!last) html += '<span class="mc-arrow" aria-hidden="true">&#8594;</span>';
    });
    html += '</div>';
    return html;
  }

  function renderHubDiagram(lesson) {
    var html = '<h3 class="mc-diagram-heading">' + esc(lesson.diagramHeading) + '</h3>';
    html += '<div class="mc-hub">';
    html += '<div class="mc-hub-center">' + esc(lesson.diagramCenter) + '</div>';
    html += '<div class="mc-hub-nodes">';
    lesson.diagramNodes.forEach(function (node) {
      html += '<div class="mc-hub-row">' +
        '<span class="mc-arrow" aria-hidden="true">&#8594;</span>' +
        '<div class="mc-hub-node">' + esc(node) + '</div>' +
      '</div>';
    });
    html += '</div></div>';
    return html;
  }

  function renderDecisionDiagram(lesson) {
    var n = lesson.diagramNodes;
    var html = '<h3 class="mc-diagram-heading">' + esc(lesson.diagramHeading) + '</h3>';
    html += '<div class="mc-decision">';
    html += '<div class="mc-decision-top">' +
      '<div class="mc-step-box">' + esc(n[0]) + '</div>' +
      '<span class="mc-arrow" aria-hidden="true">&#8594;</span>' +
      '<div class="mc-decision-node">' + esc(n[1]) + '</div>' +
    '</div>';
    html += '<div class="mc-decision-branches">';
    html += '<div class="mc-branch">' +
      '<span class="mc-branch-label">Yes</span>' +
      '<div class="mc-step-box">' + esc(n[2]) + '</div>' +
      '<span class="mc-arrow" aria-hidden="true">&#8594;</span>' +
      '<div class="mc-step-box mc-step-box--accent">' + esc(n[4]) + '</div>' +
    '</div>';
    html += '<div class="mc-branch">' +
      '<span class="mc-branch-label">No</span>' +
      '<div class="mc-step-box">' + esc(n[3]) + '</div>' +
      '<span class="mc-arrow" aria-hidden="true">&#8594;</span>' +
      '<div class="mc-step-box mc-step-box--accent">' + esc(n[4]) + '</div>' +
    '</div>';
    html += '</div></div>';
    return html;
  }

  function renderGlossary(lesson) {
    var html = '<dl class="mc-glossary">';
    lesson.terms.forEach(function (item) {
      html += '<div class="mc-glossary-row">' +
        '<dt class="mc-glossary-term">' + esc(item.term) + '</dt>' +
        '<dd class="mc-glossary-def">'  + esc(item.def)  + '</dd>' +
      '</div>';
    });
    html += '</dl>';
    return html;
  }

  function renderUseCases(lesson) {
    var html = '<div class="mc-usecases">';
    lesson.useCases.forEach(function (uc) {
      html += '<div class="mc-usecase">' +
        '<p class="mc-usecase-title">' + esc(uc.title) + '</p>' +
        '<p class="mc-usecase-desc">'  + esc(uc.desc)  + '</p>' +
      '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderOverview(lesson) {
    var html = '<p class="mc-overview-time">Estimated time to complete: ' + esc(lesson.time) + '</p>';
    html += '<h3 class="mc-overview-subheading">What you\'ll learn</h3>';
    html += '<ul class="mc-overview-list">';
    lesson.outcomes.forEach(function (o) {
      html += '<li>' + esc(o) + '</li>';
    });
    html += '</ul>';
    return html;
  }

  function renderQuiz(lesson) {
    var html = '<div class="mc-quiz">';
    lesson.questions.forEach(function (q, qi) {
      html += '<div class="mc-quiz-card" data-qi="' + qi + '">' +
        '<p class="mc-quiz-q">' + (qi + 1) + '. ' + esc(q.q) + '</p>' +
        '<ul class="mc-quiz-options">';
      q.options.forEach(function (opt, oi) {
        html += '<li class="mc-quiz-opt" data-correct="' + (oi === q.correct) + '" data-qi="' + qi + '">' +
          esc(opt) + '</li>';
      });
      html += '</ul></div>';
    });
    html += '</div>';
    return html;
  }

  // ── Navigation ────────────────────────────────────────────────

  function navigateTo(index) {
    navItems.forEach(function (n) { n.classList.remove('mockup-lesson--active'); });
    navItems[index].classList.add('mockup-lesson--active');
    currentIndex = index;
    renderLesson(index);
    var pct = Math.round((index / (navItems.length - 1)) * 100);
    progressFill.style.width = pct + '%';
    progressLabel.textContent = 'Course Progress — ' + pct + '% Complete';
    document.getElementById('mockup-content').scrollTop = 0;
  }

  // ── Main render ───────────────────────────────────────────────

  function renderLesson(index) {
    var l = lessons[index];
    var html = '<h2 class="mc-title">' + esc(l.title) + '</h2>';

    l.body.forEach(function (p) {
      html += '<p class="mc-body">' + p + '</p>';
    });

    switch (l.layout) {
      case 'overview':             html += renderOverview(l);                      break;
      case 'written-hub':          html += renderHubDiagram(l);                    break;
      case 'written-glossary':     html += renderGlossary(l);                      break;
      case 'written-video-flow':   html += renderVideo(l) + renderFlowDiagram(l);  break;
      case 'written-video':        html += renderVideo(l);                          break;
      case 'written-usecases':     html += renderUseCases(l);                      break;
      case 'written-decision':     html += renderDecisionDiagram(l);               break;
      case 'quiz':                 html += renderQuiz(l);                           break;
    }

    lessonEl.innerHTML = html;

    if (l.layout === 'quiz') initQuiz();

    if (index < lessons.length - 1) {
      nextSlot.innerHTML =
        '<button class="mc-next-btn" data-next="' + (index + 1) + '">' +
          esc(lessons[index + 1].title) +
          '<span class="mc-next-arrow" aria-hidden="true">&#8594;</span>' +
        '</button>';
      nextSlot.querySelector('.mc-next-btn').addEventListener('click', function () {
        navigateTo(index + 1);
      });
    } else {
      nextSlot.innerHTML = '';
    }
  }

  function initQuiz() {
    lessonEl.querySelectorAll('.mc-quiz-opt').forEach(function (opt) {
      opt.addEventListener('click', function () {
        var qi   = opt.getAttribute('data-qi');
        var card = lessonEl.querySelector('[data-qi="' + qi + '"].mc-quiz-card');
        card.querySelectorAll('.mc-quiz-opt').forEach(function (o) {
          o.classList.remove('mc-opt-selected', 'mc-opt-correct', 'mc-opt-wrong');
        });
        opt.classList.add('mc-opt-selected');
        opt.classList.add(opt.getAttribute('data-correct') === 'true' ? 'mc-opt-correct' : 'mc-opt-wrong');
      });
    });
  }

  // ── Nav click handlers ────────────────────────────────────────

  navItems.forEach(function (item, index) {
    item.addEventListener('click', function () { navigateTo(index); });
  });

  // Initial render
  navigateTo(currentIndex);

});


// ─── Teachable course player (Morpheus Drive sample) ──────────
document.addEventListener('DOMContentLoaded', function () {

  var player = document.querySelector('.tb-player');
  if (!player) return;

  var sidebarItems = player.querySelectorAll('.tb-lesson');
  var mainEl       = player.querySelector('.tb-main');
  var progressFill = player.querySelector('.tb-progress-fill');
  var progressText = player.querySelector('.tb-progress-text');
  var moduleSecs   = player.querySelectorAll('.tb-section');

  if (!sidebarItems.length || !mainEl) return;

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Lesson data ─────────────────────────────────────────────
  var lessons = [
    {
      type: 'diagram',
      module: 1,
      title: 'Board layout & terminals',
      done: false,
      overview: 'Before wiring up the Morpheus Drive, get familiar with where each terminal lives on the board. The diagram below labels every connection point referenced in the next video.',
      legend: [
        { label: 'M1 +/−', desc: 'Motor 1 terminals (left side)' },
        { label: 'M2 +/−', desc: 'Motor 2 terminals (right side)' },
        { label: 'V+ / V−', desc: 'Battery power input' },
        { label: 'RST',    desc: 'Reset button — press after wiring power' },
        { label: 'STAT',   desc: 'Status LED — solid blue once the system is ready' }
      ]
    },
    {
      type: 'video',
      module: 1,
      title: 'Connecting motors and the battery',
      done: false,
      duration: '3:08',
      frame: 'images/video-1.png',
      overview: 'This walkthrough shows how to connect two motors and a battery to the Morpheus Drive. Follow along with the video to complete the setup.',
      notes: [
        'Each motor connects to one pair of terminals labeled M+ and M−',
        'Make sure all wires are secured tightly before powering the system',
        'Press the reset button after connecting power',
        'A blinking blue light indicates the system is ready',
        'If a motor spins in the wrong direction, swap the wires',
        'Optional: add a switch to the red power wire for easy on/off control'
      ]
    },
    {
      type: 'annotated',
      module: 2,
      title: 'CoreOS app at a glance',
      done: false,
      image: 'images/annotated-img.png',
      overview: 'Before the next video walks through pairing, take a quick look at the CoreOS app. The labels on the screenshot point out the parts of the home screen you\'ll use in every session.',
      notes: [
        'You can return to this lesson any time you forget where a control lives.',
        'The screen looks the same on phone and tablet, just larger on tablets.',
        'Everything you see here is covered in detail in the videos that follow.'
      ]
    },
    {
      type: 'video',
      module: 2,
      title: 'Install & connect via Bluetooth',
      done: false,
      duration: '3:42',
      frame: 'images/video-2.png',
      overview: 'This walkthrough shows how to install the CoreOS app and connect it to the Morpheus Drive using Bluetooth. Follow along with the video to complete the setup.',
      notes: [
        'CoreOS is available on the Android Play Store',
        'Make sure Bluetooth is enabled before connecting',
        'Stay close to the Morpheus Drive during connection',
        'If the device does not appear, confirm the board is powered on'
      ]
    },
    {
      type: 'pdf',
      module: 3,
      title: 'Controls quick reference',
      done: false,
      fileName: 'Morpheus Drive — Controls Reference.pdf',
      fileSub: 'PDF · 4 pages · 312 KB',
      overview: 'Print or save this reference card for quick lookup of every gesture and control used during scanning and driving.',
      contains: [
        'Anchor placement gestures',
        'Scan completion checks',
        'Paint mode controls',
        'Manual driving inputs',
        'Saved route playback shortcuts'
      ]
    },
    {
      type: 'video',
      module: 3,
      title: 'Scanning and manual control',
      done: false,
      duration: '4:12',
      frame: 'images/video-3.png',
      overview: 'This walkthrough shows how to scan your environment and control movement using the CoreOS app. Follow along with the video to complete the setup.',
      notes: [
        'Place an anchor to begin scanning',
        'Move your phone around until the scan completes',
        'Paint the areas where the robot can move',
        'Leave space near edges to avoid collisions',
        'Use the controls to move the robot'
      ]
    }
  ];

  var currentIndex = 0; // matches the initial active lesson in HTML

  // ── Auto-demo state ─────────────────────────────────────────
  var STEP_MS = 5000;
  var RESUME_AFTER_INTERACTION_MS = 8000;
  var autoplayTimer = null;
  var autoplayActive = false;

  // ── Renderers ───────────────────────────────────────────────
  function videoMedia(l) {
    var frame = l.frame
      ? '<img class="tb-video-frame" src="' + esc(l.frame) + '" alt="" />'
      : '';
    return '<div class="tb-video">' +
      frame +
      '<button class="tb-play" type="button" aria-label="Play lesson">' +
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>' +
      '</button>' +
      '<div class="tb-video-controls">' +
        '<span class="tb-timecode">0:00 / ' + esc(l.duration) + '</span>' +
        '<div class="tb-video-bar"><div class="tb-video-fill" style="width:0%"></div></div>' +
        '<span class="tb-video-fs" aria-hidden="true">' +
          '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6V3h3M13 6V3h-3M3 10v3h3M13 10v3h-3"/></svg>' +
        '</span>' +
      '</div>' +
    '</div>';
  }

  function diagramMedia() {
    return '<div class="tb-diagram">' +
      '<svg class="tb-diagram-svg" viewBox="0 0 600 340" role="img" aria-label="Morpheus Drive board layout">' +
        '<rect x="40" y="30" width="520" height="280" rx="14" fill="#2e2e2e" stroke="#4a4a4a" stroke-width="2"/>' +
        '<text x="60" y="62" fill="#9a9a9a" font-family="ui-monospace,monospace" font-size="12" font-weight="600" letter-spacing="2">MORPHEUS DRIVE</text>' +
        '<circle cx="510" cy="55" r="7" fill="#3b82f6"/>' +
        '<circle cx="510" cy="55" r="11" fill="none" stroke="#3b82f6" stroke-opacity="0.35" stroke-width="2"/>' +
        '<text x="494" y="80" fill="#9a9a9a" font-size="10" text-anchor="end">STAT</text>' +
        '<rect x="450" y="98" width="60" height="30" rx="6" fill="#4a4a4a" stroke="#5a5a5a" stroke-width="1"/>' +
        '<text x="480" y="118" fill="#cccccc" font-size="10" font-weight="600" text-anchor="middle">RST</text>' +
        '<path d="M110 152 L110 178" stroke="#5a5a5a" stroke-width="1" opacity="0.5"/>' +
        '<path d="M230 152 L230 178" stroke="#5a5a5a" stroke-width="1" opacity="0.5"/>' +
        '<path d="M350 152 L350 178" stroke="#5a5a5a" stroke-width="1" opacity="0.5"/>' +
        '<text x="110" y="180" fill="#9a9a9a" font-size="10" text-anchor="middle">Motor 1</text>' +
        '<text x="230" y="180" fill="#9a9a9a" font-size="10" text-anchor="middle">Motor 2</text>' +
        '<text x="350" y="180" fill="#9a9a9a" font-size="10" text-anchor="middle">Battery</text>' +
        '<rect x="80"  y="200" width="60" height="30" rx="4" fill="#4a4a4a" stroke="#5a5a5a" stroke-width="1"/>' +
        '<text x="110" y="220" fill="#34d399" font-size="11" font-weight="700" text-anchor="middle">M1+</text>' +
        '<rect x="80"  y="240" width="60" height="30" rx="4" fill="#4a4a4a" stroke="#5a5a5a" stroke-width="1"/>' +
        '<text x="110" y="260" fill="#f87171" font-size="11" font-weight="700" text-anchor="middle">M1−</text>' +
        '<rect x="200" y="200" width="60" height="30" rx="4" fill="#4a4a4a" stroke="#5a5a5a" stroke-width="1"/>' +
        '<text x="230" y="220" fill="#34d399" font-size="11" font-weight="700" text-anchor="middle">M2+</text>' +
        '<rect x="200" y="240" width="60" height="30" rx="4" fill="#4a4a4a" stroke="#5a5a5a" stroke-width="1"/>' +
        '<text x="230" y="260" fill="#f87171" font-size="11" font-weight="700" text-anchor="middle">M2−</text>' +
        '<rect x="320" y="200" width="60" height="30" rx="4" fill="#4a4a4a" stroke="#5a5a5a" stroke-width="1"/>' +
        '<text x="350" y="220" fill="#34d399" font-size="11" font-weight="700" text-anchor="middle">V+</text>' +
        '<rect x="320" y="240" width="60" height="30" rx="4" fill="#4a4a4a" stroke="#5a5a5a" stroke-width="1"/>' +
        '<text x="350" y="260" fill="#f87171" font-size="11" font-weight="700" text-anchor="middle">V−</text>' +
      '</svg>' +
    '</div>';
  }

  function pdfMedia(l) {
    return '<div class="tb-file">' +
      '<div class="tb-file-thumb">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">' +
          '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>' +
          '<polyline points="14 2 14 8 20 8"/>' +
        '</svg>' +
        '<span class="tb-file-ext">PDF</span>' +
      '</div>' +
      '<div class="tb-file-meta">' +
        '<div class="tb-file-name">' + esc(l.fileName) + '</div>' +
        '<div class="tb-file-sub">' + esc(l.fileSub) + '</div>' +
      '</div>' +
      '<button class="tb-file-dl" type="button">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
          '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
          '<polyline points="7 10 12 15 17 10"/>' +
          '<line x1="12" y1="15" x2="12" y2="3"/>' +
        '</svg>' +
        'Download' +
      '</button>' +
    '</div>';
  }

  function annotatedMedia(l) {
    return '<div class="tb-annot">' +
      '<img class="tb-annot-img" src="' + esc(l.image) + '" alt="" />' +
    '</div>';
  }

  function mediaHTML(l) {
    if (l.type === 'video')     return videoMedia(l);
    if (l.type === 'diagram')   return diagramMedia();
    if (l.type === 'pdf')       return pdfMedia(l);
    if (l.type === 'annotated') return annotatedMedia(l);
    return '';
  }

  function overviewSection(text) {
    return '<div class="tb-lesson-section">' +
      '<h4 class="tb-lesson-subhead">Overview</h4>' +
      '<p class="tb-lesson-body">' + esc(text) + '</p>' +
    '</div>';
  }

  function bulletSection(items, heading) {
    var lis = items.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('');
    return '<div class="tb-lesson-section">' +
      '<h4 class="tb-lesson-subhead">' + esc(heading) + '</h4>' +
      '<ul class="tb-lesson-notes">' + lis + '</ul>' +
    '</div>';
  }

  function legendSection(legend) {
    var rows = legend.map(function (item) {
      return '<div class="tb-legend-row">' +
        '<dt class="tb-legend-label">' + esc(item.label) + '</dt>' +
        '<dd class="tb-legend-desc">'  + esc(item.desc)  + '</dd>' +
      '</div>';
    }).join('');
    return '<div class="tb-lesson-section">' +
      '<h4 class="tb-lesson-subhead">Legend</h4>' +
      '<dl class="tb-legend">' + rows + '</dl>' +
    '</div>';
  }

  function glossarySection(terms) {
    var rows = terms.map(function (t) {
      return '<div class="tb-glossary-row">' +
        '<dt class="tb-glossary-term">' + esc(t.term) + '</dt>' +
        '<dd class="tb-glossary-def">'  + esc(t.def)  + '</dd>' +
      '</div>';
    }).join('');
    return '<div class="tb-lesson-section">' +
      '<h4 class="tb-lesson-subhead">Terms</h4>' +
      '<dl class="tb-glossary">' + rows + '</dl>' +
    '</div>';
  }

  function annotationsSection(items) {
    var rows = items.map(function (a) {
      return '<div class="tb-annot-row">' +
        '<span class="tb-annot-row-num">' + esc(a.num) + '</span>' +
        '<div class="tb-annot-row-text">' +
          '<span class="tb-annot-row-label">' + esc(a.label) + '</span>' +
          '<span class="tb-annot-row-desc">'  + esc(a.desc)  + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
    return '<div class="tb-lesson-section">' +
      '<h4 class="tb-lesson-subhead">Annotations</h4>' +
      '<div class="tb-annot-list">' + rows + '</div>' +
    '</div>';
  }

  function bodyHTML(l) {
    if (l.type === 'video')     return overviewSection(l.overview) + bulletSection(l.notes, 'Notes');
    if (l.type === 'diagram')   return overviewSection(l.overview) + legendSection(l.legend);
    if (l.type === 'glossary')  return overviewSection(l.overview) + glossarySection(l.terms);
    if (l.type === 'pdf')       return overviewSection(l.overview) + bulletSection(l.contains, 'What\'s inside');
    if (l.type === 'annotated') return overviewSection(l.overview);
    return '';
  }

  function actionsHTML(idx) {
    var isFirst = idx === 0;
    var isLast  = idx === lessons.length - 1;
    return '' +
      '<button class="tb-btn tb-btn--ghost" type="button" data-nav="prev"' + (isFirst ? ' disabled' : '') + '>← Previous</button>' +
      '<button class="tb-btn tb-btn--primary" type="button" data-nav="next"' + (isLast ? ' disabled' : '') + '>' +
        (isLast ? 'Course complete ✓' : 'Complete and continue →') +
      '</button>';
  }

  function render(idx) {
    var l = lessons[idx];
    var html = mediaHTML(l) +
      '<div class="tb-lesson-info">' +
        '<div class="tb-lesson-eyebrow">Lesson ' + (idx + 1) + ' of ' + lessons.length + '</div>' +
        '<h3 class="tb-lesson-heading">' + esc(l.title) + '</h3>' +
        bodyHTML(l) +
      '</div>' +
      '<div class="tb-actions">' + actionsHTML(idx) + '</div>';
    mainEl.innerHTML = html;
  }

  function syncSidebar() {
    sidebarItems.forEach(function (li, i) {
      li.classList.toggle('tb-lesson--active', i === currentIndex);
      li.classList.toggle('tb-lesson--done', !!lessons[i].done);
      if (i === currentIndex) {
        li.setAttribute('aria-current', 'true');
      } else {
        li.removeAttribute('aria-current');
      }
    });

    moduleSecs.forEach(function (sec) {
      var m = parseInt(sec.getAttribute('data-module'), 10);
      var inMod = lessons.filter(function (l) { return l.module === m; });
      var done  = inMod.filter(function (l) { return l.done; }).length;
      var meta  = sec.querySelector('.tb-section-meta');
      if (meta) meta.textContent = done + ' / ' + inMod.length;
    });
  }

  function syncProgress() {
    var done = lessons.filter(function (l) { return l.done; }).length;
    var pct  = Math.round((done / lessons.length) * 100);
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressText) progressText.textContent = pct + '% complete';
  }

  function setActive(idx) {
    if (idx < 0 || idx >= lessons.length) return;
    for (var i = 0; i <= idx; i++) lessons[i].done = true;
    currentIndex = idx;
    syncSidebar();
    syncProgress();

    // Fade out → swap content → fade in
    mainEl.classList.add('tb-main--fading');
    setTimeout(function () {
      render(idx);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          mainEl.classList.remove('tb-main--fading');
        });
      });
    }, 260);
  }

  function completeAndContinue() {
    var nextIdx = Math.min(currentIndex + 1, lessons.length - 1);
    setActive(nextIdx);
  }

  // ── Auto-demo helpers ───────────────────────────────────────
  function resetProgress() {
    for (var i = 0; i < lessons.length; i++) lessons[i].done = false;
  }

  function scheduleNext(delayMs) {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
    if (!autoplayActive) return;
    autoplayTimer = setTimeout(advanceAuto, delayMs);
  }

  function advanceAuto() {
    autoplayTimer = null;
    if (currentIndex >= lessons.length - 1) {
      resetProgress();
      setActive(0);
    } else {
      setActive(currentIndex + 1);
    }
    scheduleNext(STEP_MS);
  }

  function pauseAutoplay(resumeAfterMs) {
    if (!autoplayActive) return;
    scheduleNext(resumeAfterMs);
  }

  // ── Event delegation ────────────────────────────────────────
  player.addEventListener('click', function (e) {
    var lessonLi = e.target.closest('.tb-lesson');
    if (lessonLi && player.contains(lessonLi)) {
      var idx = parseInt(lessonLi.getAttribute('data-index'), 10);
      if (!isNaN(idx)) {
        setActive(idx);
        pauseAutoplay(RESUME_AFTER_INTERACTION_MS);
      }
      return;
    }

    var navBtn = e.target.closest('[data-nav]');
    if (navBtn) {
      var dir = navBtn.getAttribute('data-nav');
      if (dir === 'prev') setActive(currentIndex - 1);
      else if (dir === 'next') completeAndContinue();
      pauseAutoplay(RESUME_AFTER_INTERACTION_MS);
    }
  });

  // Keyboard support for sidebar lessons
  sidebarItems.forEach(function (li) {
    li.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var idx = parseInt(li.getAttribute('data-index'), 10);
        if (!isNaN(idx)) {
          setActive(idx);
          pauseAutoplay(RESUME_AFTER_INTERACTION_MS);
        }
      }
    });
  });

  // ── Auto-demo trigger: start when section enters view ──────
  var prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var viewObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!autoplayActive) {
            autoplayActive = true;
            player.classList.add('is-autoplaying');
          }
          scheduleNext(STEP_MS);
        } else if (autoplayTimer) {
          clearTimeout(autoplayTimer);
          autoplayTimer = null;
        }
      });
    }, { threshold: 0.3 });

    viewObserver.observe(player);
  }

  // Initial sync (HTML already shows lesson 1; this just confirms state)
  syncProgress();

  // ── Mobile: lock .tb-main to the tallest lesson's height ───
  // Avoids the player jumping between lessons; shorter lessons get bottom whitespace.
  var MOBILE_MAX = 640;

  function lockMainHeight() {
    if (window.innerWidth > MOBILE_MAX) {
      mainEl.style.minHeight = '';
      return;
    }
    mainEl.style.minHeight = '';
    mainEl.style.visibility = 'hidden';
    var maxH = 0;
    for (var i = 0; i < lessons.length; i++) {
      render(i);
      if (mainEl.scrollHeight > maxH) maxH = mainEl.scrollHeight;
    }
    render(currentIndex);
    mainEl.style.minHeight = maxH + 'px';
    mainEl.style.visibility = '';
  }

  // Preload lesson images so their natural heights are known at measurement time
  function preloadLessonImages() {
    var urls = [];
    lessons.forEach(function (l) {
      if (l.frame) urls.push(l.frame);
      if (l.image) urls.push(l.image);
    });
    return Promise.all(urls.map(function (url) {
      return new Promise(function (resolve) {
        var img = new Image();
        img.onload = img.onerror = function () { resolve(); };
        img.src = url;
      });
    }));
  }

  preloadLessonImages().then(lockMainHeight);

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(lockMainHeight, 200);
  });
});


// ─── Features grid: living preview animations ────────────────
document.addEventListener('DOMContentLoaded', function () {

  var grid    = document.getElementById('features-grid');
  var section = document.getElementById('features-showcase');
  if (!grid || !section) return;

  var cards = grid.querySelectorAll('.fc-card');
  if (!cards.length) return;

  // Respect reduced-motion preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  grid.classList.add('has-anims');

  // Card-level entry observer — adds .is-animating with a small stagger as each
  // card scrolls into view. Cards stay observed so they can re-trigger after a reset.
  var cardObserver = new IntersectionObserver(function (entries) {
    var stagger = 0;
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.classList.contains('is-animating')) {
        var delay = stagger;
        stagger += 90;
        setTimeout(function () {
          entry.target.classList.add('is-animating');
        }, delay);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(function (card) { cardObserver.observe(card); });

  // Section-level reset observer — when the whole section leaves the viewport,
  // strip .is-animating from every card so re-entering replays the animations.
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        cards.forEach(function (card) { card.classList.remove('is-animating'); });
      }
    });
  }, { threshold: 0 });

  sectionObserver.observe(section);
});


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


// ─── Number counters (data-counter) ──────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  var prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  function format(n) {
    return String(Math.round(n));
  }

  function animate(el) {
    var target = parseInt(el.getAttribute('data-counter'), 10);
    if (isNaN(target)) return;
    if (prefersReduced) { el.textContent = format(target); return; }

    var duration = 1600;
    var start = null;
    var startVal = 0;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(startVal + (target - startVal) * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = format(target);
    }

    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  counters.forEach(function (el) { io.observe(el); });
});


// ─── Hero floats: idle bob + scroll parallax + mouse parallax ─
document.addEventListener('DOMContentLoaded', function () {
  var prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  var hero = document.getElementById('hero');
  if (!hero) return;

  var parallaxEls = hero.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  // Per-element config + state
  var els = Array.prototype.map.call(parallaxEls, function (el) {
    var phaseStyle = getComputedStyle(el).getPropertyValue('--phase').trim();
    var phaseMs = parseFloat(phaseStyle) * (phaseStyle.indexOf('ms') !== -1 ? 1 : 1000);
    if (isNaN(phaseMs)) phaseMs = 0;
    var rotStyle = getComputedStyle(el).getPropertyValue('--rot').trim();
    var rotDeg = parseFloat(rotStyle);
    if (isNaN(rotDeg)) rotDeg = 0;
    return {
      el: el,
      pScroll: parseFloat(el.getAttribute('data-parallax')) || 0.2,
      pMouse: parseFloat(el.getAttribute('data-mouse') || '0'),
      phase: phaseMs,
      rot: rotDeg
    };
  });

  var mx = 0, my = 0;
  var cmx = 0, cmy = 0;
  var scrollOffset = 0;
  var heroInView = true;
  var rafId = null;

  function tick(ts) {
    cmx += (mx - cmx) * 0.08;
    cmy += (my - cmy) * 0.08;

    for (var i = 0; i < els.length; i++) {
      var item = els[i];
      // Idle sinusoidal bob (period 6500ms, amplitude 10px)
      var bob = Math.sin((ts + item.phase) / 6500 * Math.PI * 2) * 10;
      var ty = scrollOffset * item.pScroll + bob + (cmy * item.pMouse);
      var tx = cmx * item.pMouse;
      item.el.style.transform =
        'translate3d(' + tx.toFixed(2) + 'px, ' + ty.toFixed(2) + 'px, 0)' +
        (item.rot !== 0 ? ' rotate(' + item.rot + 'deg)' : '');
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

  hero.addEventListener('mousemove', function (e) {
    var rect = hero.getBoundingClientRect();
    mx = ((e.clientX - rect.left) / rect.width) - 0.5;
    my = ((e.clientY - rect.top) / rect.height) - 0.5;
    start();
  }, { passive: true });

  hero.addEventListener('mouseleave', function () {
    mx = 0; my = 0;
    start();
  });

  // Pause when hero leaves viewport
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        heroInView = entry.isIntersecting;
        if (heroInView) start();
      });
    }, { threshold: 0 });
    io.observe(hero);
  }

  // Scroll parallax
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





// ─── About widget: tap-to-close (anywhere but Email me) + Escape ──
document.addEventListener('DOMContentLoaded', function () {
  var widget = document.getElementById('about-widget');
  if (!widget) return;

  document.addEventListener('click', function (e) {
    if (!widget.open) return;
    // The summary toggles the details natively — don't interfere.
    var trigger = widget.querySelector('summary');
    if (trigger && trigger.contains(e.target)) return;
    // Tapping the email button shouldn't close the widget mid-action.
    var email = widget.querySelector('.about-widget-email');
    if (email && email.contains(e.target)) return;
    widget.open = false;
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && widget.open) widget.open = false;
  });
});


