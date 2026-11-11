// src/data/projects.js
// Draft built from github.com/zeroTwoishan on Oct 5, 2026.
// Anything marked TODO needs your input. Everything else came from your READMEs and repo files.
// Plain JavaScript only (no JSX, no image imports), so Node scripts and any frontend can both read it.
// The one import is stats.json, which both Node and Vite read with `with { type: 'json' }`.

import stats from './stats.json' with { type: 'json' }

// Counts come from stats.json (refreshed by scripts/fetch-stats.mjs), never typed by hand.
const solved = stats.leetcode.solved

export const bio = {
  name: 'Ishan Keshari',
  role: 'Full-Stack Developer · learning ML',
  pitch: 'Engineering student at NIT Jalandhar who builds full-stack web apps, and is now learning machine learning.',
  about:
    `I'm Ishan, a 2nd-year Instrumentation and Control student at NIT Jalandhar. I build full-stack web apps with React, Node and MongoDB. Right now that's mostly XCEED, the learning platform our college actually uses, plus side projects like Darkroom, a photo editor that does the real work on a server. I solve problems in C++ on LeetCode most days (${solved} so far), and I'm learning machine learning from scratch with CampusX's 100 Days of ML.`, // draft from QUESTIONS.md 1.3
  siteUrl: 'https://ishan-keshari.vercel.app', // your final portfolio URL
  photo: '/media/portrait/ishan-edit-720.webp', // generated from source-media/ishan.png by scripts/images.mjs
  openTo: 'Open to research or software internships: winter (20 Dec 2026 – 20 Jan 2027) and summer 2027', // '' hides the badge
  // Draft written from these notes on 2026-11-07 at Ishan's request; Ishan will edit it.
  approach:
    "I study Instrumentation and Control, so I tend to see everything as a system: inputs, feedback, and what breaks when one part fails. I learn by building. When I came across the image-processing project on roadmap.sh, I built Darkroom instead of bookmarking it. When LeetHub couldn't push the problems I had already solved, I built LitGit to do it. Machine learning is next, and I'm learning it the same way: one problem, one experiment, one commit at a time.",
  coords: { lat: 31.395778, lng: 75.535286 }, // NIT Jalandhar, confirmed by Ishan
}

// "My story" timeline (QUESTIONS.md 5.1)
export const story = [
  { when: '2025', what: 'Qualified JEE Advanced and joined NIT Jalandhar (B.Tech ICE)' },
  { when: 'Jun–Jul 2026', what: 'First web projects over the summer break, including CineScope and LitGit' },
  { when: 'Aug 2026', what: 'Joined Team XCEED as a full-stack developer and built features for XCEED Learning' },
  { when: 'Sep 2026', what: 'Selected after the Smart India Hackathon 2026 internal round at NIT Jalandhar' },
  { when: 'Oct 2026', what: 'Darkroom went live; 300 LeetCode problems solved' },
  { when: 'Nov 2026', what: 'Started learning machine learning; applied for IIT research internships' },
]

export const projects = [
  // Darkroom: strongest solo project, so it's the first card.
  // Talking points from the README:
  // - Non-destructive edits: every Apply saves a new version; the original is never changed
  // - Live preview in the browser (CSS transforms/filters, drag-to-crop); the server only makes the file on Apply
  // - Sharp pipeline: orient → rotate → flip → crop → resize → filters → watermark → encode
  // - Versions de-duplicated by a sha256 fingerprint of photo + edits
  // - JWT auth, Zod validation, per-user rate limiting, helmet + CORS
  // - EXIF/GPS stripped on upload; an hourly cleanup job deletes photos 12 hours after upload
  // - Logged-out visitors can try the editor; nothing is stored for them
  // - API tests in GitHub Actions CI; Playwright end-to-end tests
  {
    slug: 'darkroom',
    title: 'Darkroom',
    summary:
      'A photo editor that runs in the browser and does the real work on a server: live preview, one Apply, non-destructive versions.',
    problem:
      "I wanted to test the backend skills I had just learned. I saw roadmap.sh's Image Processing Service idea, knew I could build it, and ended up with my own image-editing website.",
    role: 'Solo project: backend, frontend, deployment and tests',
    stack: ['Node.js', 'Express', 'MongoDB', 'Sharp', 'React 19', 'Vite', 'Zod', 'JWT', 'Docker', 'GitHub Actions'],
    challenge:
      'Keeping edits non-destructive and cheap. The browser previews every change instantly, the server builds the file once on Apply, and identical edits are de-duplicated by a sha256 fingerprint.',
    result:
      'Live, with CI on every push. Photos are private by design: location data is stripped on upload and everything is deleted after 12 hours.',
    live: 'https://darkroom-ishan.vercel.app',
    repo: 'https://github.com/zeroTwoishan/image-processing-service',
    year: 2026,
    status: 'Live',
    // Web sizes made by scripts/images.mjs; the animated original stays at /media/darkroom.webp.
    img: { base: '/media/darkroom-poster', widths: [800, 1120], w: 1120, h: 700 },
    preview: '/media/darkroom.webp', // animated demo, swapped in while the print is on screen (desktop)
    alt: 'The Darkroom photo editor with an image open and editing controls beside it',
  },

  // XCEED Learning: team project. Only features confirmed from Ishan's own commits are listed.
  // Not on the portfolio: classes with join codes, Shorts live polls, AI Studio, per-student tutorial numbers,
  // and the access tests.
  //
  // Talking points (your work):
  // - Quizzes: the quiz timer is enforced on the server and answer keys never reach the student's browser
  // - In-browser running and auto-checking of students' Python and C notebook submissions with
  //   hidden test cases (replaced PDF uploads), plus one-click PDF download of every submission for faculty
  // - Student onboarding: bulk import from the institute's ERP roster (.xlsx), admin roster with
  //   email invitations, and a tool to merge duplicate departments
  // - Timetable integration: student timetable view, classroom rooms pulled from the timetable, and a
  //   node-cron job that reminds faculty at 9 AM on working days to set up missing classrooms
  // - Auth fixes (no signed-in user in localStorage, JWT cookie cleared on logout), complex-number
  //   answers in tutorials and assignments, 30-second autosave in teacher editors
  {
    slug: 'xceed-learning',
    title: 'XCEED Learning',
    summary:
      "The learning module of XCEED, NIT Jalandhar's in-house platform for attendance, timetables and teaching (web, Android and iOS).",
    problem:
      'Students submitted lab work as PDFs and teachers checked every one by hand. Now code runs in the browser and is marked automatically against hidden test cases.',
    role: 'Full-stack developer in Team XCEED (Aug 2026 – present); one of 5 main contributors to the learning module, 170+ contributions to the team repos',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'node-cron'],
    challenge:
      "Running students' Python and C code safely in the browser and marking it against test cases they can't see.",
    result: 'Used across the whole of NIT Jalandhar, on web, Android and iOS.',
    live: '', // no public demo; while empty, no "Live demo" link shows
    repo: 'https://github.com/zeroTwoishan/AMS-with-TimeTable/tree/main/server/src/modules/learningModule',
    year: 2026,
    status: 'In use at NIT Jalandhar',
    img: { base: '/media/xceed-learning', widths: [800, 1600], w: 1600, h: 1200 }, // demo data only
    alt: 'XCEED Learning notebook submission screen, auto-checked against test cases',
  },

  // Talking points from the README:
  // - Merges two different APIs (TMDB REST for movies/TV, AniList GraphQL for anime) into one UI
  // - Trailers play in portal-mounted modals
  // - Watchlist saved in localStorage, sortable by format, year, title or rating
  {
    slug: 'cinescope',
    title: 'CineScope',
    summary: 'One place to explore movies, TV series and anime, with trailers and a personal watchlist.',
    problem: 'I wanted one place to look up movies, shows and anime instead of switching between different apps.',
    role: 'Solo project: design, frontend and deployment',
    stack: ['React 19', 'Vite', 'React Router 7', 'Tailwind CSS v4', 'TMDB API', 'AniList GraphQL API', 'Vercel'],
    challenge:
      'Merging TMDB (REST) and AniList (GraphQL), which return completely different data, into one search and one card layout.',
    result: 'Live on Vercel.', // add users or feedback here if you get any
    live: 'https://cine-scope-zeta-five.vercel.app',
    repo: 'https://github.com/zeroTwoishan/cine-scope',
    year: 2026,
    status: 'Live',
    img: { base: '/media/cinescope', widths: [800, 1280], w: 1280, h: 800 },
    alt: 'CineScope home screen showing movie, TV and anime cards',
  },

  // Talking points (from the CV):
  // - Commits every accepted LeetCode solution to GitHub automatically, with the problem statement
  //   and runtime/memory stats
  // - Bulk-sync dashboard imports all past solutions through a background worker tab
  // - Rate limiting to stay inside GitHub API limits
  // - Works on LeetCode.com and LeetCode.cn
  {
    slug: 'litgit',
    title: 'LitGit',
    summary:
      'A Chrome extension that commits every accepted LeetCode solution to GitHub, with the problem statement and runtime and memory stats.',
    problem:
      "Inspired by LeetHub, which I couldn't use to push the problems I had already solved. LitGit adds a bulk sync, so all my older solutions went to GitHub too.",
    role: 'Solo project',
    stack: ['JavaScript', 'Chrome Extensions (Manifest V3)', 'GitHub API'],
    challenge:
      'Bulk-syncing every past solution through a background tab without hitting GitHub API rate limits.',
    result:
      'Syncs every accepted solution, with the problem statement and runtime and memory stats, on LeetCode.com and LeetCode.cn. Installed from the GitHub repo (not on the Chrome Web Store).',
    live: '', // not on the Chrome Web Store; installed from the repo
    repo: 'https://github.com/zeroTwoishan/LitGit',
    year: 2026,
    status: 'Install from repo',
    img: null, // ⏳ Ishan is recording a short clip; until then the Work section shows an "undeveloped frame"
  },
]

// Not included: whatsapp_bot (dropped Nov 5, 2026), CurrencyConverter (replaced by Darkroom; still on GitHub), number-guessing-game,
// dice-game, Drum-kit, 25-MAY (early learning projects), himvani (SIH 2026 idea, docs only so far),
// MyLeetCode (used for the stats instead).

// Matches the CV. Keep only what you'd be happy to be quizzed on in an interview.
export const skills = {
  Languages: ['C++', 'JavaScript', 'Python', 'C', 'Java (basics)'],
  Frontend: ['React', 'Vite', 'Tailwind CSS', 'React Router', 'Chakra UI'],
  Backend: ['Node.js', 'Express', 'REST APIs', 'JWT', 'MongoDB'],
  Tools: ['Git', 'GitHub Actions', 'Docker', 'Linux', 'Vercel', 'Chrome Extensions'],
  'Data & AI': ['NumPy', 'pandas', 'Learning ML'],
}

export const contact = {
  email: 'ivankaishan09092007@gmail.com',
  github: 'https://github.com/zeroTwoishan',
  leetcode: 'https://leetcode.com/u/ishan_zerotwo/',
  linkedin: 'https://www.linkedin.com/in/ishan-keshari-410266398/',
  // TODO: create a free form at formspree.io and paste its URL (https://formspree.io/f/xxxx) to receive messages
  // directly. While empty, the Send a message form opens the visitor's email app instead.
  formEndpoint: '',
}

// Drafts: Ishan will edit these later.
export const funFacts = [
  'Real Madrid fan. Mbappé is my guy.',
  'Horror films are my comfort watch.',
  'I watch a lot of anime.',
  'I type Hindi in Roman letters all day (Hinglish).',
  `${solved} LeetCode problems, almost all in C++.`,
  'I wrote a Chrome extension so my LeetCode solutions push themselves to GitHub.',
  'I keep design-language docs from ~75 companies for UI ideas.',
  'Spare Arduino Nanos and ESP boards live in my drawer.',
  'Learning machine learning in Hindi with CampusX.',
]

// Lessons section (QUESTIONS.md 7.3).
export const lessons = [
  {
    title: 'Free hosting goes to sleep',
    what:
      "Darkroom's API runs on Render's free plan, which sleeps after 15 idle minutes, so the first request after a break takes about a minute.",
    learned:
      'Free hosting has cold starts. Plan for them from the start: tell visitors the server is waking up, or keep it warm with a scheduled ping.',
  },
]
