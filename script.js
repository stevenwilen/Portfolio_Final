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
