/* Static multi-page generator for the workshop site.
   Run: `node build_site.js`  → writes index.html, call.html, schedule.html,
   speakers.html, organizers.html. Edit content here, then rebuild.        */
const fs = require("fs");

const SITE_TITLE = "Transitioning from Pre-Training to Post-Training";
const VENUE = "NeurIPS 2026";
const DATE = "December 11, 2026";
const LOCATION = "Sydney, Australia";

const NAV = [
  { href: "index.html",      label: "Home" },
  { href: "call.html",       label: "Call for Papers" },
  { href: "schedule.html",   label: "Schedule" },
  { href: "speakers.html",   label: "Speakers" },
  { href: "organizers.html", label: "Organizers" },
];

const SPEAKERS = [
  { name: "Sergey Levine",   affil: "UC Berkeley",                       url: "https://people.eecs.berkeley.edu/~svlevine/", img: "levine.jpg" },
  { name: "Hanna Hajishirzi", affil: "University of Washington & Microsoft", url: "https://homes.cs.washington.edu/~hannaneh/", img: "hajishirzi.jpg" },
  { name: "Sewon Min",       affil: "UC Berkeley & AI2",                 url: "https://www.sewonmin.com/",                    img: "min.jpg" },
  { name: "Jason Weston",    affil: "Meta FAIR & NYU",                   url: "https://www.thespermwhale.com/jaseweston/",    img: "weston.jpg" },
];

const ORGANIZERS = [
  { name: "Sham Kakade",     affil: "Harvard · Kempner Institute", url: "https://shamulent.github.io", img: "kakade.jpg", initials: "SK" },
  { name: "Eran Malach",     affil: "Apple ML Research",           url: "https://www.eranmalach.com",  img: null,         initials: "EM" },
  { name: "Samy Jelassi",    affil: "Microsoft Research NE",       url: "https://sjelassi.github.io",  img: "jelassi.jpg", initials: "SJ" },
  { name: "Clara Mohri",     affil: "Harvard University",          url: "https://cmohri.github.io/", img: "mohri.jpg", initials: "CM" },
  { name: "Sunny (Tian) Qin", affil: "Harvard University",         url: "https://sunnytqin.github.io", img: "qin.jpg",    initials: "SQ" },
  { name: "Rachit Bansal",   affil: "Harvard SEAS · Contact",      url: "https://rachitbansal.github.io", img: "bansal.jpg", initials: "RB" },
  { name: "Harman Singh",    affil: "UC Berkeley",                 url: "https://harmandotpy.github.io", img: "singh.jpg", initials: "HS" },
];

const TOPICS = [
  ["Pre-training as a substrate", "Data mixtures and curricula, late-pre-training stages (continued/mid-training, LR-decay), and predictive pre-training signals for post-training outcomes."],
  ["The mechanics of post-training", "Procedural contrasts across SFT/RLXF/RLVR/distillation, sharpening vs. broadening of capabilities, and mechanistic localization of alignment, refusal, persona, and reasoning."],
  ["Failure modes", "Mode/entropy collapse and reward hacking, alignment tax and capability forgetting, and theoretical lower bounds on what post-training can accomplish."],
  ["Data &amp; optimization in the transition", "Curriculum and synthetic data, scaling laws for SFT/preference/RL data, and how LR schedules, optimizer-state inheritance, and regularization shape what is recoverable."],
  ["Re-imagining the pipeline", "Folding post-training data into pre-training, and joint pipeline design when pre- and post-training are co-designed for compute, data, and objectives."],
  ["Evaluation &amp; open science", "Evaluating whether post-training &ldquo;succeeded&rdquo; beyond benchmark deltas, and pre-training metrics that are actually predictive of post-training success."],
];

const SCHEDULE = [
  ["09:00&ndash;09:15", "Registration &amp; opening remarks", ""],
  ["09:15&ndash;10:15", "Invited talks 1&ndash;2", "25 min + 5 min Q&amp;A each"],
  ["10:15&ndash;10:45", "Coffee &amp; Poster session I", ""],
  ["10:45&ndash;12:00", "Contributed talks", "4 &times; 15 min + 3 min Q&amp;A"],
  ["12:00&ndash;13:30", "Lunch", "independent"],
  ["13:30&ndash;14:30", "Invited talks 3&ndash;4", ""],
  ["14:30&ndash;15:30", "Panel: &ldquo;What must pre-training get right for post-training to succeed?&rdquo;", "moderated"],
  ["15:30&ndash;16:00", "Coffee &amp; Poster session II", ""],
  ["16:00&ndash;17:00", "Contributed talks", "4 &times; 15 min"],
  ["17:00&ndash;17:30", "Closing remarks &amp; open mic", ""],
];

const DATES = [
  ["Submission portal opens", "August 1, 2026", "2026-08-01"],
  ["Submission deadline", "Aug 29 &rsquo;26 (Anywhere on Earth)", "2026-08-29"],
  ["Author notification", "Sep 29 &rsquo;26 (Anywhere on Earth)", "2026-09-29"],
  ["Camera-ready / poster upload", "", ""],
  ["Workshop day", DATE, "2026-12-11"],
];

/* ---------- shared partials ---------- */
function head(title, rel) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="A ${VENUE} workshop on the interaction between pre-training and post-training in modern foundation models. ${LOCATION}, ${DATE}." />
  <meta property="og:title" content="${SITE_TITLE} — ${VENUE} Workshop" />
  <meta property="og:description" content="Crystallizing the science of the pre-training-to-post-training transition in foundation models." />
  <meta property="og:type" content="website" />
  <link rel="stylesheet" href="${rel}assets/style.css" />
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>`;
}

function header(active, rel) {
  const items = NAV.map(function (n) {
    const cur = n.href === active ? ' aria-current="page"' : "";
    return `        <li><a href="${rel}${n.href}"${cur}>${n.label}</a></li>`;
  }).join("\n");
  return `
  <header class="site-header" id="top">
    <nav class="nav" aria-label="Primary">
      <a class="nav__brand" href="${rel}index.html">
        <span class="nav__brand-mark">P&#8202;→&#8202;P</span>
        <span class="nav__brand-text">Pre&#8202;→&#8202;Post</span>
      </a>
      <button class="nav__toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav__menu" id="nav-menu">
${items}
      </ul>
    </nav>
  </header>`;
}

function footer(rel) {
  return `
  <footer class="site-footer">
    <div class="wrap footer__inner">
      <p class="footer__title">${SITE_TITLE}</p>
      <p class="footer__sub">First edition &middot; ${VENUE} &middot; ${LOCATION} &middot; ${DATE}</p>
      <p class="footer__credit">Livestreamed &amp; recorded &middot; Non-archival &middot; OpenReview</p>
    </div>
  </footer>
  <script src="${rel}assets/script.js"></script>
</body>
</html>`;
}

function pageHeader(eyebrow, title, intro) {
  return `
    <section class="page-header">
      <div class="wrap">
        ${eyebrow ? `<p class="page-header__eyebrow">${eyebrow}</p>` : ""}
        <h1 class="page-header__title">${title}</h1>
        ${intro ? `<p class="page-header__intro">${intro}</p>` : ""}
      </div>
    </section>`;
}

function personCard(p, big) {
  const size = big ? "" : " avatar--sm";
  const media = p.img
    ? `<img class="avatar${size}" src="assets/img/${p.img}" alt="${p.name}" loading="lazy" width="${big ? 108 : 72}" height="${big ? 108 : 72}" />`
    : `<span class="avatar${size}" data-initials="${p.initials}" aria-hidden="true"></span>`;
  return `          <a class="person" href="${p.url}" target="_blank" rel="noopener">
            ${media}
            <span class="person__name">${p.name} <span class="person__ext" aria-hidden="true">↗</span></span>
            <span class="person__affil">${p.affil}</span>
          </a>`;
}

/* ---------- page bodies ---------- */
function homeMain() {
  return `
  <main id="main">
    <section class="hero">
      <div class="wrap">
        <p class="hero__eyebrow">${VENUE} Workshop</p>
        <h1 class="hero__title">Transitioning from Pre-Training to Post-Training</h1>
        <p class="hero__lede">
          A workshop on the interaction between pre-training and post-training in modern
          foundation models &mdash; what a base model must possess for post-training to
          succeed, how each procedure reshapes it, and when the transition fails.
          Our goal is to crystallize the <em>science</em> of this transition.
        </p>
        <dl class="hero__facts">
          <div><dt>Date</dt><dd>${DATE}</dd></div>
          <div><dt>Location</dt><dd>${LOCATION}</dd></div>
          <div><dt>Venue</dt><dd>${VENUE} &middot; <span class="tbd">page link TBD</span></dd></div>
        </dl>
        <div class="hero__actions">
          <a class="btn btn--primary" href="call.html">Call for Papers</a>
          <a class="btn btn--ghost" href="speakers.html">Invited speakers</a>
        </div>
        <p class="hero__meta">
          Full-day, in-person &middot; Non-archival short &amp; long papers &middot; Hosted on OpenReview
        </p>
      </div>
    </section>

    <section class="section">
      <div class="wrap wrap--narrow">
        <h2 class="section__title">Overview</h2>
        <p>
          Foundation-model development has grown into a complicated, multi-stage pipeline.
          Large-scale pre-training via next-token prediction is followed by mid-training and/or
          continual pre-training, and then by an increasingly complex post-training phase &mdash;
          supervised fine-tuning, preference optimization (e.g., DPO), RLHF, RL with verifiable
          rewards (RLVR), self-improvement, and distillation. Yet we lack a principled understanding
          of how these stages relate: what each stage is for, what capabilities it must inherit, and
          which steps are actually necessary. As instruction and reasoning data increasingly enters
          the pre-training mix, the boundary between &ldquo;pre&rdquo; and &ldquo;post&rdquo; is
          itself becoming blurry.
        </p>
        <div class="callout">
          <h3 class="callout__title">Why now</h3>
          <p>
            Recent work shows this interaction is more consequential than previously understood.
            <em>Catastrophic overtraining</em> (Springer et al., 2025) demonstrates that extending
            pre-training beyond a certain token budget can make models <em>harder</em> to fine-tune,
            degrading post-training even as pre-training loss improves. State-of-the-art reasoning
            systems rely on RL post-training but typically require SFT warm-up, meaning
            pre-training-side sensitivities can cascade through multiple stages before surfacing as
            failures. Meanwhile, fully open pipelines such as OLMo and Pythia now provide intermediate
            checkpoints, data, and code &mdash; making controlled study of this transition feasible
            for the first time.
          </p>
        </div>
        <h3 class="subsection__title">Central questions</h3>
        <ol class="q-list">
          <li>What pre-training behaviors, representations, or data signatures are required for post-training to succeed &mdash; and how do we even define &ldquo;success&rdquo;?</li>
          <li>Beyond targeted benchmarks, what secondary effects do SFT, DPO, RLXF, RLVR, self-improvement, and distillation have on the model?</li>
          <li>When does post-training fail (mode/entropy collapse, reward hacking, alignment tax, capability forgetting), and can pre-training-side signals predict failure?</li>
          <li>How do data composition, curriculum, mid-training, optimizer choices, and architecture during pre-training mediate downstream post-training quality?</li>
        </ol>
        <div class="cta">
          <a class="btn btn--primary" href="call.html">Read the Call for Papers</a>
        </div>
      </div>
    </section>
  </main>`;
}

function callMain() {
  const cards = TOPICS.map(function (t) {
    return `          <article class="card"><h3 class="card__title">${t[0]}</h3><p>${t[1]}</p></article>`;
  }).join("\n");
  const dates = DATES.map(function (d) {
    const attr = d[2] ? ` data-date="${d[2]}"` : "";
    const date = d[1] ? `<span class="timeline__date">${d[1]}</span>` : `<span class="timeline__date tbd">TBD</span>`;
    return `          <li class="timeline__item"${attr}>${date}<span class="timeline__label">${d[0]}</span></li>`;
  }).join("\n");
  return `
  <main id="main">
    ${pageHeader(VENUE + " Workshop", "Call for Papers",
      "We invite <strong>short and long papers</strong> on any topic below, formatted in the author&rsquo;s choice of <strong>NeurIPS</strong>, <strong>ICML</strong>, or <strong>ICLR</strong> style. Submissions are non-archival; work already published at NeurIPS or other major ML conferences is not eligible.")}

    <section class="section">
      <div class="wrap">
        <h2 class="section__title">Topics of interest</h2>
        <p class="section__intro">
          We solicit theoretical, empirical, and methodological work across the following areas.
          This list is not exhaustive.
        </p>
        <div class="cards">
${cards}
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="wrap wrap--narrow">
        <h2 class="section__title">Submission</h2>
        <ul class="facts">
          <li><span class="facts__k">Submission portal</span><span class="facts__v"><span class="tbd">OpenReview link — TBD</span></span></li>
          <li><span class="facts__k">Tracks</span><span class="facts__v">Short and long papers</span></li>
          <li><span class="facts__k">Format</span><span class="facts__v">Author&rsquo;s choice of <strong>NeurIPS</strong>, <strong>ICML</strong>, or <strong>ICLR</strong> style file</span></li>
          <li><span class="facts__k">Page limit</span><span class="facts__v">Matches the chosen format&rsquo;s own main-conference limit (excluding references &amp; appendix): <strong>9 pages</strong> for NeurIPS, <strong>8 pages</strong> for ICML, <strong>9 pages</strong> for ICLR</span></li>
          <li><span class="facts__k">Archival?</span><span class="facts__v">No &mdash; accepted papers hosted on OpenReview as non-archival</span></li>
          <li><span class="facts__k">Eligibility</span><span class="facts__v">No work already published at NeurIPS or other major ML venues</span></li>
          <li><span class="facts__k">Reviewing</span><span class="facts__v">Each submission must nominate a reciprocal reviewer, who may be contacted to review if additional reviewers are needed</span></li>
        </ul>
        <p class="note">
          All talks and the panel will be livestreamed and recorded.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="wrap wrap--narrow">
        <h2 class="section__title">Important dates</h2>
        <p class="section__intro">
          Deadlines are 11:59&nbsp;PM Anywhere on Earth (AoE). Unconfirmed dates are marked
          <span class="tbd">TBD</span> and will be posted soon.
        </p>
        <ul class="timeline">
${dates}
        </ul>
      </div>
    </section>
  </main>`;
}

function scheduleMain() {
  const rows = SCHEDULE.map(function (s) {
    const note = s[2] ? ` <span class="muted">(${s[2]})</span>` : "";
    const hl = /Panel/.test(s[1]) ? " schedule__highlight" : "";
    return `            <tr><td class="schedule__time">${s[0]}</td><td class="${hl.trim()}">${s[1]}${note}</td></tr>`;
  }).join("\n");
  return `
  <main id="main">
    ${pageHeader(VENUE + " Workshop", "Tentative schedule",
      "A full day (~8.5 hours, in-person): two contributed-talk sessions, two poster sessions, four invited talks, and one curated panel debate. The agenda is tentative and will be finalized closer to the event.")}
    <section class="section">
      <div class="wrap wrap--narrow">
        <table class="schedule" aria-label="Tentative workshop schedule">
          <tbody>
${rows}
          </tbody>
        </table>
        <p class="note">Talk titles and the finalized public agenda will be posted prior to ${VENUE} scheduling.</p>
      </div>
    </section>
  </main>`;
}

function speakersMain() {
  const cards = SPEAKERS.map(function (p) { return personCard(p, true); }).join("\n");
  return `
  <main id="main">
    ${pageHeader(VENUE + " Workshop", "Invited speakers",
      "Four invited talks span reinforcement learning, open pre-/post-training, the science of pre-training data, and reasoning. Click any speaker to visit their page.")}
    <section class="section">
      <div class="wrap">
        <div class="people">
${cards}
        </div>
      </div>
    </section>
  </main>`;
}

function organizersMain() {
  const cards = ORGANIZERS.map(function (p) { return personCard(p, false); }).join("\n");
  return `
  <main id="main">
    ${pageHeader(VENUE + " Workshop", "Organizers",
      "The organizing team spans senior faculty, industry research scientists, and PhD students across Harvard, UC Berkeley, Apple, and Microsoft Research.")}
    <section class="section">
      <div class="wrap">
        <div class="orgs">
${cards}
        </div>
        <p class="note">A program committee is being formed from the organizers&rsquo; collaboration network, with explicit junior-researcher representation.</p>
      </div>
    </section>
    <section class="section section--alt">
      <div class="wrap wrap--narrow contact">
        <h2 class="section__title">Contact</h2>
        <p>
          Questions about the workshop or submissions? Reach out to the workshop point of contact,
          <a href="mailto:rachitbansal@g.harvard.edu">Rachit Bansal</a>.
        </p>
      </div>
    </section>
  </main>`;
}

/* ---------- emit ---------- */
const rel = ""; // all pages at root
const PAGES = [
  ["index.html",      `${SITE_TITLE} — ${VENUE} Workshop`, homeMain()],
  ["call.html",       `Call for Papers — ${SITE_TITLE}`,   callMain()],
  ["schedule.html",   `Schedule — ${SITE_TITLE}`,          scheduleMain()],
  ["speakers.html",   `Speakers — ${SITE_TITLE}`,          speakersMain()],
  ["organizers.html", `Organizers — ${SITE_TITLE}`,        organizersMain()],
];

PAGES.forEach(function (pg) {
  const html = head(pg[1], rel) + header(pg[0], rel) + pg[2] + footer(rel) + "\n";
  fs.writeFileSync(pg[0], html);
  console.log("wrote", pg[0], html.length, "bytes");
});
