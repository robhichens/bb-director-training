# Bright Beginnings Director Training App — Full Context

> **Last updated:** May 2026  
> **Repo:** `C:\Users\robhi\bb-director-training`  
> **Live URL:** https://bb-director-training.netlify.app *(confirm exact subdomain in Netlify dashboard)*

---

## 1. What This App Is

A private, self-paced training platform for Bright Beginnings Preschool directors. It walks a new director through the complete operations manual across 7 modules, tests their knowledge with 100%-pass quizzes, gives them interactive scenario practice, and provides an ongoing Daily Brief with contextual tips and a task tracker. An AI assistant ("Birdie") is available throughout for instant Q&A.

**Who uses it:** Newly hired directors at Bright Beginnings locations.  
**Who owns it:** Rob Hichens (admin credentials below).

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | React Router v7 |
| Animations | Framer Motion |
| Styling | CSS Modules + CSS custom properties |
| Auth / Progress | localStorage (no Firebase auth) |
| Analytics | Firebase Firestore (quiz attempts, scenario choices) |
| AI (Birdie) | Anthropic Claude Haiku via Netlify Function |
| Deployment | Netlify (CI/CD from main branch) |
| Build output | `dist/` — single-page app |

---

## 3. File Structure

```
bb-director-training/
├── netlify/
│   └── functions/
│       └── birdie.js              # Serverless function — proxies Anthropic API
├── public/
│   └── images/                    # bird-coral.png, tree-full-color.png, etc.
├── scripts/
│   └── patch-quizzes.mjs          # One-time script: added questions to reach 10/quiz
├── src/
│   ├── App.jsx                    # Router, context providers, BirdieGate
│   ├── main.jsx                   # React entry point
│   ├── styles/
│   │   └── variables.css          # Brand tokens (colours, spacing, fonts)
│   ├── context/
│   │   ├── AuthContext.jsx        # User login/logout — reads/writes localStorage
│   │   ├── ProgressContext.jsx    # Module progress state + overall % 
│   │   └── BirdieContext.jsx      # Lifts Birdie open state app-wide
│   ├── utils/
│   │   └── progressTracker.js     # localStorage CRUD for user + progress
│   ├── lib/
│   │   ├── firebase.js            # Firestore initialisation
│   │   ├── analytics.js           # recordQuizAttempt(), recordScenarioChoice()
│   │   ├── syncProgress.js        # (future) sync progress to Firestore
│   │   ├── tipEngine.js           # Daily Brief tip library + query functions
│   │   └── taskStore.js           # Daily/monthly task completion persistence
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── layout/
│   │   │   ├── ModuleLayout.jsx   # Shell: Header + Sidebar + main content
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx        # Nav: Daily Brief link + module list
│   │   │   └── Sidebar.module.css
│   │   ├── content/
│   │   │   ├── Quiz.jsx           # Quiz component — 10q, 100% to pass
│   │   │   ├── ReadingSection.jsx # Renders markdown reading content
│   │   │   └── ScenarioCard.jsx   # Interactive scenario chooser
│   │   └── shared/
│   │       ├── BirdieChat.jsx     # Floating AI chat drawer
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       └── ProgressBar.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx          # Home: module grid + Daily Brief card
│   │   ├── Dashboard.module.css
│   │   ├── Briefing.jsx           # Daily Brief page (full task tracker)
│   │   ├── Briefing.module.css
│   │   └── admin/
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx # Firestore analytics viewer
│   │       ├── AdminDashboard.module.css
│   │       └── adminAuth.js       # Hardcoded credentials + sessionStorage session
│   └── modules/
│       ├── module1/ → Module1.jsx, Module1.module.css, content.json
│       ├── module2/ → Module2.jsx, Module2.module.css, content.json
│       ├── module3/ → Module3.jsx, Module3.module.css, content.json
│       ├── module4/ → Module4.jsx, Module4.module.css, content.json
│       ├── module5/ → Module5.jsx, Module5.module.css, content.json
│       ├── module6/ → Module6.jsx, Module6.module.css, content.json
│       └── module7/ → Module7.jsx, Module7.module.css, content.json
├── .env                           # Firebase keys (gitignored)
├── netlify.toml                   # Build config + function bundler
└── package.json
```

---

## 4. Routing

All protected routes require a logged-in user (checked via `useAuth`). Unauthenticated users are redirected to `/login`.

| Path | Component | Notes |
|---|---|---|
| `/` | → redirect | → `/dashboard` |
| `/login` | `Login` | Public — redirects to `/dashboard` if already logged in |
| `/signup` | `Signup` | Public |
| `/dashboard` | `Dashboard` | Module grid + Daily Brief entry card |
| `/briefing` | `Briefing` | Daily Brief full page |
| `/module/1` – `/module/7` | `Module1`…`Module7` | Protected |
| `/admin/login` | `AdminLogin` | Separate layout, no sidebar |
| `/admin` | `AdminDashboard` | Separate layout, no sidebar |

**Provider nesting order (App.jsx):**
```
BrowserRouter > AuthProvider > ProgressProvider > BirdieProvider > AppRoutes + BirdieGate
```

---

## 5. Authentication

**User auth** is entirely localStorage-based — no Firebase auth, no passwords server-side.

- On signup: user enters name, email, and location (centre). Saved to `localStorage` key `bb-director-user` as `{ name, email, location }`.
- On login: same data re-entered; matched against stored value.
- `AuthContext` exposes: `user`, `login(userData)`, `logout()`, `updateUser(updates)`.
- Logout clears `bb-director-user` from localStorage.

**Admin auth** (`adminAuth.js`):
- Credentials hardcoded: username `robhichens13` / password `bbtraining1984!`
- Session stored in `sessionStorage` (expires on browser close — intentional, not localStorage).
- `isAdminAuthed()` / `clearAdminSession()` helpers used by AdminDashboard.

---

## 6. Progress Model

Progress is stored in `localStorage` key `bb-director-progress`.

**Shape:**
```js
{
  module1: {
    status: 'completed' | 'in-progress' | 'not-started' | 'locked',
    sectionsCompleted: ['1.1', '1.1-quiz', ...],
    currentSection: '1.3',
    quizScores: {
      '1.1-quiz': { score: 100, passed: true, attempts: 2, lastAttempt: 'ISO' }
    },
    completedAt: 'ISO' | null,
  },
  module2: { ... },
  // ... through module7
}
```

**Rules:**
- Modules unlock sequentially: module2 unlocks only when module1 is `completed`, etc.
- Module7 (Reference Library) is always accessible once module6 is complete.
- `getOverallProgress()` returns 0–100: completed modules = full weight, in-progress = 0.5 weight.
- `ProgressContext` reads/writes `progressTracker.js` functions and exposes `overallPct`.

**Birdie visibility gate:** Birdie chat FAB is hidden until `overallPct > 0`, _except_ on `/briefing` where it's always shown.

---

## 7. Module Content

All content lives in each module's `content.json`. Each module has a `title` and `sections` array.

**Section types:**
- `reading` — markdown text rendered by `ReadingSection.jsx`
- `quiz` — array of questions rendered by `Quiz.jsx`
- `scenario` — interactive scenario choices rendered by `ScenarioCard.jsx`

### Module 1 — Foundation & Culture (13 sections)
| ID | Type | Title |
|---|---|---|
| 1.1 | reading | Our Rules & Culture |
| 1.1-quiz | quiz (10q) | Core Rules Quiz |
| 1.2 | reading | Staff Quality Framework: A, B, C & D |
| 1.2-activity | scenario | Staff Rating Scenarios |
| 1.3 | reading | Director KPIs & Enrollment Targets |
| 1.3-quiz | quiz (10q) | KPI Knowledge Check |
| 1.4 | reading | Core Values & Our Story |
| 1.4-quiz | quiz (10q) | Values & Story Quiz |
| 1.5 | reading | Admin Team Rules & Dress Code |
| 1.5-quiz | quiz (10q) | Admin Standards Quiz |
| 1.6 | reading | Staff Minimum Expectations |
| 1.7 | reading | Staff Duties System |
| 1.7-quiz | quiz (10q) | Staff Expectations Quiz |

### Module 2 — Daily Operations (13 sections)
| ID | Type | Title |
|---|---|---|
| 2.1 | reading | The Director's Day: 7:30 AM to Close |
| 2.1-quiz | quiz (10q) | Daily Timeline Quiz |
| 2.2 | reading | Morning Routines & Communications |
| 2.2-activity | scenario | Morning Routine Decisions |
| 2.3 | reading | Weekly Rhythm: Monday Through Friday |
| 2.3-quiz | quiz (10q) | Weekly Duties Quiz |
| 2.4 | reading | Running a Great Tour |
| 2.4-activity | scenario | Tour Decisions |
| 2.5 | reading | Enrollment: Tour to First Day |
| 2.5-quiz | quiz (10q) | Enrollment Process Quiz |
| 2.6 | reading | Weekly Duties: Day-by-Day Detail |
| 2.7 | reading | The Phone Success Script |
| 2.7-activity | scenario | Phone Script Scenarios |

### Module 3 — People Management (10 sections)
| ID | Type | Title |
|---|---|---|
| 3.1 | reading | Hiring the Right People |
| 3.1-quiz | quiz (10q) | Hiring Process Quiz |
| 3.2 | reading | Scheduling, Ratios & Labor Budget |
| 3.2-quiz | quiz (10q) | Scheduling & Ratios Quiz |
| 3.3 | reading | Staff Meetings & Appreciation |
| 3.3-activity | scenario | Staff Leadership Decisions |
| 3.4 | reading | Performance Management & Termination |
| 3.4-quiz | quiz (10q) | Performance Management Quiz |
| 3.5 | reading | New Hire Document Checklist |
| 3.6 | reading | Termination: Full Details |

### Module 4 — Business Operations (11 sections)
| ID | Type | Title |
|---|---|---|
| 4.1 | reading | Director KPIs & Enrollment Targets |
| 4.1-quiz | quiz (10q) | KPIs & Enrollment Quiz |
| 4.2 | reading | Billing, Tuition & Collections |
| 4.2-activity | scenario | Collections Decisions |
| 4.3 | reading | ProCare: Your Command Center |
| 4.3-quiz | quiz (10q) | ProCare Quiz |
| 4.4 | reading | The Monthly Calendar & Director Packet |
| 4.4-quiz | quiz (10q) | Monthly Operations Quiz |
| 4.5 | reading | Monthly Calendar: Day-by-Day Detail |
| 4.6 | reading | Billing Mechanics |
| 4.6-quiz | quiz (10q) | Billing Mechanics Quiz |

### Module 5 — Compliance & Safety (14 sections)
| ID | Type | Title |
|---|---|---|
| 5.1 | reading | Virginia Licensing & the Binder |
| 5.1-quiz | quiz (10q) | Licensing & Binder Quiz |
| 5.2 | reading | Daily Health & Safety Protocols |
| 5.2-quiz | quiz (10q) | Health & Safety Quiz |
| 5.3 | reading | Injury, Accident & Incident Reporting |
| 5.3-activity | scenario | Safety Incident Decisions |
| 5.4 | reading | Emergency Procedures |
| 5.4-quiz | quiz (10q) | Emergency Procedures Quiz |
| 5.5 | reading | Classroom Setup Standards |
| 5.5-quiz | quiz (10q) | Classroom Compliance Quiz |
| 5.6 | reading | Situational Protocols |
| 5.6-activity | scenario | Situational Scenarios |
| 5.7 | reading | Field Trip Guide |
| 5.7-quiz | quiz (10q) | Field Trip Compliance Quiz |

### Module 6 — Communication & Community (10 sections)
| ID | Type | Title |
|---|---|---|
| 6.1 | reading | Building Trust with Every Family |
| 6.1-quiz | quiz (10q) | Parent Communication Quiz |
| 6.2 | reading | Marketing & Enrollment Growth |
| 6.2-activity | scenario | Communication Scenarios |
| 6.3 | reading | Scripts for Hard Conversations |
| 6.3-quiz | quiz (10q) | Scripts & Situations Quiz |
| 6.4 | reading | Community Presence & Online Reputation |
| 6.4-quiz | quiz (10q) | Community & Marketing Quiz |
| 6.5 | reading | Seasonal Operations & Annual Events |
| 6.5-quiz | quiz (10q) | Seasonal Operations Quiz |

### Module 7 — Director Reference Library (5 sections, no quizzes)
| ID | Type | Title |
|---|---|---|
| 7.1 | reading | Vendor & Contact Directory |
| 7.2 | reading | Key Links & System Access |
| 7.3 | reading | ProCare Quick Reference |
| 7.4 | reading | Tadpoles Reference |
| 7.5 | reading | Director Quick-Start Checklist |

**Quiz rules (Quiz.jsx):**
- 10 questions per quiz, 100% pass threshold (`PASS_THRESHOLD = 1.0`)
- Question types: `multiple-choice` (with `options[]`) or `true-false`
- Unlimited retakes
- Correct answers + explanations shown after submission
- Quiz scores saved to `localStorage` and written to Firestore `quizAttempts` collection

---

## 8. Daily Brief (`/briefing`)

A live dashboard of contextual operational reminders, updated by time of day, day of week, and date of month.

### Tip Engine (`src/lib/tipEngine.js`)

Tips are defined in a `TIPS` array. Each tip has:

```js
{
  id: 'unique-string',
  section: 'rightNow' | 'today' | 'thisMonth' | 'thisSeason',
  category: 'Operations' | 'Health & Safety' | 'Communications' | 'Enrollment' | ...,
  urgency: 'high' | 'medium' | 'low',
  title: '🚸 Short headline',
  body: 'One to three sentence detail.',
  birdiePrompt: 'Pre-filled question sent to Birdie when Ask Birdie is clicked',
  triggers: { timeStart: 7, timeEnd: 9 }     // OR
           | { days: [1, 2] }                 // 0=Sun … 6=Sat
           | { dates: [27] }                  // day-of-month 1–31
           | { months: [6] }                  // 1–12
           | { always: true, rotateIndex: 0 } // rotates by dayOfYear % 4
}
```

**Post-processing (PROCESSED_TIPS):**
- `trackable: false` for time-triggered tips (no checkbox)
- `trackable: true` for all others
- `scope: 'monthly'` for date-triggered tips; `scope: 'daily'` for everything else

**Exported query functions:**
- `getRightNowTips(now)` — tips whose time window includes current hour
- `getTodayTips(now)` — day-of-week, always-rotating, and seasonal tips for today
- `getAllMonthTips()` — ALL date-triggered tips for the month (shown all month, not just on their date)

### Page Layout (`src/pages/Briefing.jsx`)

Four stacked sections:

1. **⏰ Right Now** — time-window tips (not trackable, no checkbox)
2. **📋 Today — [Day]** — day-of-week + rotating + seasonal tips (daily scope)
3. **📅 [Month] Tasks** — all date-triggered tips for the month (monthly scope)
4. **🚨 Not Completed** — trackable tips not yet checked, shown as clickable bars

Section headers show a `done/total` pill that turns green and says **"Done!"** when all tasks are complete.

**Tile interaction:**
- Click tile → opens modal with full body text
- Modal has task checkbox (timestamps completion) → auto-closes modal 280ms after checking
- Modal has small "Ask Birdie" pill button (opens Birdie chat with pre-filled prompt)
- Completed tiles: greyed out (opacity 0.58), title struck through, large ✓ in bottom-right corner

### Task Store (`src/lib/taskStore.js`)

Persists completions in `localStorage` key `bb-daily-tasks`:

```js
{
  daily:   { "2026-05-22": { "tip-id": { checked: true, checkedAt: "ISO" } } },
  monthly: { "2026-05":    { "tip-id": { checked: true, checkedAt: "ISO" } } }
}
```

- `daily` scope resets each calendar day (new date key = blank slate)
- `monthly` scope persists for the full calendar month

---

## 9. Birdie AI Chat

A floating chat drawer available to all logged-in users who have started training (or are on `/briefing`).

**Architecture:**
- **Front-end:** `src/components/shared/BirdieChat.jsx` — floating FAB + slide-up drawer
- **Back-end:** `netlify/functions/birdie.js` — Netlify serverless function
- **Model:** `claude-haiku-4-5-20251001` (Anthropic), `max_tokens: 512`
- **API key:** `ANTHROPIC_API_KEY` — server-side only, never exposed to browser (no `VITE_` prefix)
- **Conversation history:** last 10 turns sent per request for context
- **Input cap:** 2,000 characters per message

**BirdieContext (`src/context/BirdieContext.jsx`):**
- Lifts open state app-wide so any component can open Birdie with a pre-filled prompt
- `openWithPrompt(text)` — opens drawer and pre-fills the input
- Used by: Daily Brief tile modals (Ask Birdie button), Dashboard (future use)

**Birdie system prompt persona:**
- Name: Birdie
- Scope: BB operations/culture, Virginia childcare licensing (Title 22 / VDSS), ECE best practices, staff management
- Tone: warm, practical, direct — "seasoned director mentor"
- Will not give legal advice; recommends admin/attorney for HR/legal
- Will not engage in emergencies — directs to 911 and emergency procedures

---

## 10. Admin Dashboard

**URL:** `/admin` (preceded by `/admin/login`)  
**Credentials:** username `robhichens13` / password `bbtraining1984!`  
**Session:** `sessionStorage` only — expires on browser close

**What it shows (reads from Firestore):**
- All user quiz attempts (`quizAttempts` collection): score, pass/fail, answer breakdown
- All scenario choices (`scenarioChoices` collection): which option chosen, whether correct
- Per-user progress summary (aggregated from quiz data)
- Timestamps shown as relative ("3h ago") and absolute

---

## 11. Firebase / Analytics

**Config:** Stored in `.env` (gitignored) as `VITE_FIREBASE_*` variables. Also set in Netlify dashboard > Environment Variables.

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

**Firestore collections:**

| Collection | Written when | Key fields |
|---|---|---|
| `quizAttempts` | User submits any quiz | userId, moduleId, sectionId, score, passed, answers[], timestamp |
| `scenarioChoices` | User picks a scenario option | userId, moduleId, scenarioIndex, chosenLabel, correct, timestamp |

Firebase is **only used for analytics write** — it does not store auth or progress (that's all localStorage).

---

## 12. Brand & Design Tokens

Defined in `src/styles/variables.css`. Key tokens:

```css
--bb-coral:       #F08782   /* primary brand colour — buttons, accents, headings */
--bb-green:       #4CAF82   /* success states */
--bb-charcoal:    #3D3D3D   /* body text */
--bb-mid-gray:    #888888   /* secondary text */
--bb-light-gray:  #E8E8E8   /* borders, dividers */
--bb-off-white:   #F9F9F9   /* card backgrounds */
--bb-white:       #FFFFFF

--font-heading:   'Fredoka One', cursive       /* module titles, hero text */
--font-body:      'Ubuntu', 'Calibri', sans-serif

--card-radius:    12px
--btn-radius:     8px
--transition:     0.18s ease
```

---

## 13. localStorage Keys Summary

| Key | Contents | Reset |
|---|---|---|
| `bb-director-user` | `{ name, email, location }` | On logout |
| `bb-director-progress` | Full module progress object | Never (accumulates) |
| `bb-daily-tasks` | Daily Brief task completions (daily + monthly scopes) | daily = per day; monthly = per month |

---

## 14. Deployment

- **Host:** Netlify
- **Trigger:** Push to `main` branch → auto-deploy
- **Build command:** `npm run build`
- **Publish dir:** `dist`
- **Functions dir:** `netlify/functions` (esbuild bundler)
- **Environment vars set in Netlify dashboard:** All `VITE_FIREBASE_*` keys + `ANTHROPIC_API_KEY`

**Dev command:** `npm run dev` (Vite dev server, HMR)

---

## 15. Known Constraints & Decisions

- **No server-side user auth** — deliberate. App is private/internal; localStorage-only keeps it simple and dependency-free.
- **`ANTHROPIC_API_KEY` must never have a `VITE_` prefix** — would expose it in the browser bundle. Lives only in `netlify/functions/birdie.js` via `process.env`.
- **Admin credentials are hardcoded** — `adminAuth.js`. Not a Firebase user. Change by editing that file.
- **Module 7 has no quizzes** — it's a reference library, not a training module.
- **Chunk size warning** in build is expected — all module content JSON is bundled together. Not a problem at current scale.
- **`syncProgress.js` exists but is not yet wired up** — placeholder for future Firestore progress sync (Phase 5 token handoff with bb-platform).

---

## 16. Pending / Future Work

- **Phase 5:** Token handoff integration with `bb-platform` (C:\Users\robhi\bb-platform) — so a director who completes training is automatically recognised in the main staff hub
- **Content drafts** (local only, not committed): five `.md` files in `content-drafts/` — emergency protocols, substitute management, tour technique, licensing inspection prep, new family onboarding — ready to be reviewed and potentially added as new module sections
- **`syncProgress.js`** — infrastructure for syncing localStorage progress to Firestore is stubbed but not active
- **Module 7 interactivity** — currently reading-only; no quizzes or scenarios
