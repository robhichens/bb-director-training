# BB Director Training — Handover Document

**Live URL:** https://bbdirector.netlify.app  
**Repo:** https://github.com/robhichens/bb-director-training  
**Last updated:** May 2026  
**Stack:** React 19 + Vite 8 · CSS Modules · Framer Motion · Firebase Firestore · Netlify (CI/CD + Functions)

---

## 1. What This Is

A self-paced web training platform for Bright Beginnings Preschool directors. Staff sign up, work through 7 sequential modules of reading/quizzes/scenario exercises, and can ask "Birdie" (an AI assistant) questions at any time. An admin dashboard lets ownership track each person's progress across all locations.

---

## 2. Feature Summary

| Feature | Where | Notes |
|---|---|---|
| Auth (signup/login) | `src/components/auth/` | localStorage only — no Firebase Auth |
| 7 training modules | `src/modules/module1–7/` | sequential unlock, per-section completion |
| Progress tracking | `src/utils/progressTracker.js` | localStorage primary; Firestore mirror |
| Birdie AI chat | `src/components/shared/BirdieChat.jsx` | Claude Haiku via Netlify Function |
| Daily Brief | `src/pages/Briefing.jsx` | contextual tips by time/day/date/month |
| Admin dashboard | `src/pages/admin/AdminDashboard.jsx` | reads Firestore `userProgress` collection |
| Firebase analytics | `src/lib/analytics.js` | quiz attempts + scenario choices logged |

---

## 3. Project Structure

```
bb-director-training/
├── netlify/
│   └── functions/
│       └── birdie.js          # Serverless function — Anthropic API call (API key lives here)
├── public/
│   └── images/                # All brand assets (logos, bird, tree)
├── src/
│   ├── App.jsx                # Router, providers, BirdieGate
│   ├── main.jsx
│   ├── context/
│   │   ├── AuthContext.jsx    # user state (localStorage)
│   │   ├── ProgressContext.jsx # progress state + Firestore sync
│   │   └── BirdieContext.jsx  # open/pendingPrompt — enables Ask Birdie from any page
│   ├── components/
│   │   ├── auth/              Login.jsx, Signup.jsx
│   │   ├── layout/            ModuleLayout.jsx, Header.jsx, Sidebar.jsx (+ .module.css)
│   │   ├── content/           ReadingSection.jsx, Quiz.jsx, ScenarioCard.jsx
│   │   └── shared/            BirdieChat.jsx, Button.jsx, Card.jsx, ProgressBar.jsx
│   ├── modules/
│   │   ├── module1/           Module1.jsx, Module1.module.css, content.json
│   │   ├── module2/           ...
│   │   ├── module3/           ...
│   │   ├── module4/           ...
│   │   ├── module5/           ...
│   │   ├── module6/           ...
│   │   └── module7/           Module7.jsx (Reference Library — no quiz required to complete)
│   ├── pages/
│   │   ├── Dashboard.jsx      # module grid + Daily Brief entry card
│   │   ├── Briefing.jsx       # Daily Brief page
│   │   └── admin/
│   │       ├── adminAuth.js   # hardcoded credentials + sessionStorage gate
│   │       ├── AdminLogin.jsx
│   │       └── AdminDashboard.jsx
│   ├── lib/
│   │   ├── firebase.js        # Firestore init (uses VITE_FIREBASE_* env vars)
│   │   ├── analytics.js       # logQuizAttempt, logScenarioChoice → Firestore
│   │   ├── syncProgress.js    # syncProgressToFirestore, createUserProfile
│   │   └── tipEngine.js       # 45 contextual tips + getTipsForNow() / getTipsGrouped()
│   ├── utils/
│   │   └── progressTracker.js # localStorage CRUD, module unlock logic
│   └── styles/
│       ├── variables.css      # All CSS custom properties (colors, fonts, spacing)
│       └── global.css
```

---

## 4. Environment Variables

### Local development — `.env` (gitignored, never commit)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Netlify dashboard — Environment Variables
Set the same six `VITE_FIREBASE_*` variables **plus**:
```
ANTHROPIC_API_KEY=sk-ant-...    ← NO VITE_ prefix — server-side only
```

> **Security rule:** `ANTHROPIC_API_KEY` must never have a `VITE_` prefix. It only runs inside `netlify/functions/birdie.js`. Adding `VITE_` would expose it in the browser bundle.

---

## 5. Auth & User Model

Auth is **not Firebase Auth** — it's a custom localStorage store.

```js
// localStorage key: 'bb-director-user'
{
  name: "Rob Hichens",
  email: "rob@example.com",
  location: "Mill Creek",   // Forest Lakes | Mill Creek | Crozet
  createdAt: "2025-01-01T..."
}
```

Signup creates the user object and calls `createUserProfile(user)` to seed a Firestore doc. Login looks up by email + password (stored in Firestore `users` collection or plaintext — check `AuthContext.jsx` for the exact lookup).

---

## 6. Progress Model

**Primary store:** `localStorage` key `bb-director-progress`

```js
{
  module1: {
    status: 'completed',          // locked | not-started | in-progress | completed
    sectionsCompleted: ['1.1','1.2','1.3'],
    currentSection: null,
    quizScores: {
      'quiz-1.1': { score: 4, passed: true, attempts: 1, lastAttempt: '...' }
    },
    completedAt: '2025-05-01T...'
  },
  module2: { status: 'in-progress', ... },
  module3: { status: 'locked', ... },
  ...
}
```

**Unlock logic** (`progressTracker.js`): Modules unlock sequentially. When a module is marked complete, the next one flips from `locked` → `not-started`. There's also a migration pass in `getProgress()` that handles existing users who completed a module before a new one was added.

**Overall %** = `(completed + in-progress × 0.5) / 7 × 100` (rounded)

**Firestore mirror** (`lib/syncProgress.js`): Every progress mutation fires `syncProgressToFirestore()` as a fire-and-forget call. Failure is silently swallowed — it never blocks the UI.

---

## 7. Firestore Collections

| Collection | Purpose | Written by |
|---|---|---|
| `userProgress` | One doc per user, keyed by sanitized email. Stores `overallPct`, `lastUpdated`, per-module `status` | `syncProgress.js` on every progress save |
| `quizAttempts` | One doc per quiz attempt — module, score, timestamp | `analytics.js` |
| `scenarioChoices` | One doc per scenario answer — module, choice, timestamp | `analytics.js` |

Doc ID for `userProgress` = email with `@`, `.`, `+` replaced by `_`, lowercased, max 64 chars.

---

## 8. Module Content Schema

Each module has a `content.json` with this shape:

```json
[
  {
    "id": "1.1",
    "title": "Section Title",
    "type": "reading",
    "learningObjectives": ["..."],
    "content": "Markdown string..."
  },
  {
    "id": "quiz-1.1",
    "title": "Knowledge Check",
    "type": "quiz",
    "questions": [
      {
        "id": "q1",
        "text": "Question text?",
        "options": ["A", "B", "C", "D"],
        "correct": 0,
        "explanation": "Why A is correct..."
      }
    ]
  },
  {
    "id": "scenario-1.1",
    "title": "Real-World Scenario",
    "type": "scenario",
    "scenarios": [
      {
        "id": "s1",
        "situation": "You walk in and see...",
        "options": [...],
        "bestChoice": 0,
        "debrief": "Here's why..."
      }
    ]
  }
]
```

### Adding a new section to an existing module

1. Open `src/modules/moduleN/content.json`
2. Append your section object(s) to the array
3. `reading` sections auto-render via `ReadingSection.jsx`; `quiz` via `Quiz.jsx`; `scenario` via `ScenarioCard.jsx`
4. No code changes required — the module JSX iterates the content array

### Adding a new module (module 8, etc.)

1. Add `'module8'` to `MODULE_ORDER` in both `progressTracker.js` and `syncProgress.js`
2. Create `src/modules/module8/` with `Module8.jsx`, `Module8.module.css`, `content.json`
3. Import and add route in `App.jsx`
4. Add entry to `MODULES` array in `Dashboard.jsx` and `Sidebar.jsx`
5. The previous last module's "complete" screen should link forward — add a `navigate('/module/8')` button

---

## 9. Birdie AI Assistant

**Architecture:** Browser → Netlify Function → Anthropic Claude Haiku

- **Context:** Last 10 message turns sent per request (capped at 2,000 chars input)
- **Model:** `claude-haiku-4-5-20251001` — fast and cost-effective
- **System prompt:** Defined at top of `netlify/functions/birdie.js`. Covers BB operations, VA Title 22 licensing, ECE best practices, staff management. Warm/practical tone.
- **BirdieContext:** `open`, `setOpen`, `pendingPrompt`, `setPendingPrompt`, `openWithPrompt(text)` — any page can call `openWithPrompt()` to pre-fill and open the chat drawer
- **Visibility gate:** Birdie shows after any training progress OR always on `/briefing`

---

## 10. Daily Brief (`/briefing`)

Pulls tips from `src/lib/tipEngine.js` — 45 tips across four trigger types:

| Trigger | Example |
|---|---|
| `{ timeStart: 7, timeEnd: 9.25 }` | Drop-off visibility (7–9:15 AM) |
| `{ days: [3] }` | Wednesday: maintenance list by 12 PM |
| `{ dates: [27] }` | Day 27: BILLING DAY |
| `{ months: [5] }` | May: Teacher Appreciation Week |
| `{ always: true, rotateIndex: 0–3 }` | Rotates 4 evergreen reminders daily |

Each tip has a `birdiePrompt` field — the exact question pre-loaded when "Ask Birdie →" is clicked.

**To add a new tip:** Append to the `TIPS` array in `tipEngine.js`. Pick the right `section` (`rightNow` | `today` | `thisMonth` | `thisSeason`) and `triggers`.

---

## 11. Admin Dashboard (`/admin`)

- **Login:** `robhichens13` / `bbtraining1984!` (hardcoded in `adminAuth.js`)
- **Session:** `sessionStorage` — expires when the browser tab closes
- **Data source:** Firestore `userProgress` collection (read-only)
- **Features:** Stats row (total/completed/active/not-started/avg%), location filter tabs, sortable table (name/location/overall/last active), per-module status pips

Access the admin button (4-square grid icon) in the top-right of the training portal header.

---

## 12. Deployment

Auto-deploys on every push to `main` via Netlify CI.

```bash
npm run build      # local build check (should complete ~700ms, no errors)
git push origin main   # triggers Netlify deploy (~60–90 seconds)
```

**Netlify config:** `netlify.toml` (if present) or Netlify dashboard settings.  
**Functions:** `netlify/functions/birdie.js` deploys automatically as a serverless function.

---

## 13. Brand / Design Tokens

All in `src/styles/variables.css`:

| Variable | Value | Use |
|---|---|---|
| `--bb-coral` | `#F08782` | Primary brand, CTAs, accents |
| `--bb-charcoal` | `#3D3D3D` | Body text, headings |
| `--bb-yellow` | `#FFF3C4` | Resume bar, highlight |
| `--bb-green` | `#4CAF82` | Completed state |
| `--bb-off-white` | `#FAF9F7` | Page background |
| `--font-display` | `'Fredoka One', cursive` | Titles, module headers |
| `--font-body` | `'Ubuntu', sans-serif` | All body text |

---

## 14. Known Constraints & Gotchas

- **No real auth security** — localStorage auth is fine for a single-org internal tool but would need Firebase Auth or similar before any public deployment
- **Admin credentials in client-side JS** — `adminAuth.js` ships in the browser bundle; acceptable for internal use, not for anything externally facing
- **Chunk size warning** — Vite warns that the bundle is >500 kB. Non-critical for this use case; fix with dynamic `import()` on module content if load time becomes an issue
- **Birdie history** — chat history resets on page reload (intentional; no persistence)
- **Firestore sync is one-way** — progress reads from localStorage, writes mirror to Firestore. Never reads back from Firestore for the user's own session
- **Date-based tips** — `tipEngine.js` uses `new Date()` at render time. Tips do not auto-refresh if the page stays open across midnight

---

## 15. Module Content Reference

| Module | Sections | Key Topics |
|---|---|---|
| 1 — Foundation & Culture | 1.1–1.7 | Core principles, A/B/C/D staff ratings, KPIs, daily/weekly duties, cell phone policy, Tadpoles standards |
| 2 — Daily Operations | 2.1–2.7 | 7:30 AM–close timeline, weekly duties (Mon–Fri with exact times), ProCare paths, phone script (10 steps, $25,800 LTV) |
| 3 — People Management | 3.1–3.6 | Hiring, scheduling, corrective action, Career Ladder, new hire document checklist, termination process |
| 4 — Business Operations | 4.1–4.6 | Monthly calendar deep-dive (Day 1–29), billing mechanics (TE Merchant IDs, CCA codes), DSS, Warrant in Debt |
| 5 — Compliance & Safety | 5.1–5.7 | VA Title 22, ratios, bleach concentrations, situational protocols (snow day, licensing walk-in), field trip guide |
| 6 — Communication & Community | 6.1–6.5 | Parent relationships, Canva/Tadpoles, difficult conversations, seasonal operations (12-month guide) |
| 7 — Reference Library | 7.1–7.5 | Vendor contacts, key links (Canva login, DSS URLs), ProCare quick reference, Tadpoles reference, Director Quick-Start Checklist |

---

## 16. Quick-Start for a New Developer

```bash
git clone https://github.com/robhichens/bb-director-training.git
cd bb-director-training
npm install

# Create .env with Firebase keys (get from Rob or Firebase console)
cp .env.example .env   # or create manually — see Section 4

npm run dev            # → http://localhost:5173
```

Sign up with any email at `/signup`, pick a location, and start Module 1. Admin dashboard is at `/admin` (credentials in Section 11).
