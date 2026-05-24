# BB Director Training App — Competencies Feature Prompt

> **Feature:** Interactive Competency Tracker (Option 2)  
> **Target App:** `bb-director-training` (React 19 + Vite)  
> **Goal:** Add a standalone competency checklist page where directors track their onboarding progress through ~200+ discrete skills

---

## What We're Building

An interactive, self-tracking competency checklist that mirrors the printed "Director Training Competencies" document currently used for onboarding. Directors can mark items as "Introduced" and "Completed" with auto-timestamping, view progress by category, and print/export their checklist for quarterly reviews with trainers.

---

## User Stories

1. **As a new director**, I want to see all the competencies I need to master during onboarding, organized by category, so I know what's expected of me.

2. **As a new director**, I want to mark items as "Introduced" when my trainer first teaches me the skill, and "Completed" when I've demonstrated mastery, so I can track my progress.

3. **As a new director**, I want to see my overall completion percentage and category-level progress, so I feel a sense of accomplishment as I learn.

4. **As a director**, I want to print or export my competency checklist with timestamps, so I can review it with my trainer during 1:1s or save it for my records.

5. **As a trainer (Rob/Nancy)**, I want to see which competencies the director has marked complete during our meetings, so I can verify and plan next training sessions.

---

## Where It Lives

### New Route
- **Path:** `/competencies`
- **Component:** `src/pages/Competencies.jsx` + `Competencies.module.css`
- **Protection:** Requires logged-in user (same auth pattern as other pages)
- **Layout:** Uses `ModuleLayout` (Header + Sidebar + main content area)

### Navigation
- Add "Competency Tracker" link to **Sidebar** (after "Daily Brief", before module list)
- Icon: 📋 or ✅
- Badge showing completion % when > 0% (e.g., "78%")

### Dashboard Card (optional Phase 1.5)
- Add a card to Dashboard (`Dashboard.jsx`) titled "Track Your Skills"
- Shows overall % and a "View Tracker →" CTA
- Same visual treatment as the Daily Brief card

---

## Data Model

### localStorage Key
`bb-director-competencies`

### Data Structure

```json
{
  "lastUpdated": "2026-05-24T14:30:00.000Z",
  "items": {
    "org-chart-accountability": {
      "id": "org-chart-accountability",
      "categoryId": "org-chart",
      "introduced": true,
      "introducedDate": "2026-05-12T09:00:00.000Z",
      "completed": true,
      "completedDate": "2026-05-19T15:30:00.000Z"
    },
    "org-chart-roles": {
      "id": "org-chart-roles",
      "categoryId": "org-chart",
      "introduced": true,
      "introducedDate": "2026-05-12T09:00:00.000Z",
      "completed": false,
      "completedDate": null
    }
    // ... ~200+ items
  }
}
```

### Category Structure

Categories are defined in a `competenciesData.js` constant (see Content Structure section below). Each category has:

```js
{
  id: 'org-chart',
  title: 'Organization Chart',
  items: [
    {
      id: 'org-chart-accountability',
      label: 'Accountability/communication chart'
    },
    {
      id: 'org-chart-roles',
      label: 'Individual roles and responsibilities'
    },
    // ...
  ]
}
```

---

## Content Structure

Create `src/data/competenciesData.js` with the full competency list organized into categories. Map the printed document's structure to this format:

### Categories (12 total):

1. **Foundation** (4 items)
   - Attends Regional Licensing Training
   - Manuals to modules
   - Organization Chart
   - _(Note: "Organization Chart" is both a category header and a top-level item in the original doc — handle as needed)_

2. **Organization Chart** (6 items)
   - Accountability/communication chart
   - Individual roles and responsibilities
   - Job descriptions by position: Director
   - Job descriptions by position: Finance
   - Job descriptions by position: Administration
   - Job descriptions by position: Maintenance

3. **Meetings** (2 items)
   - Admin Meetings
   - Weekly Staff Meetings

4. **Calendars** (5 items)
   - Family yearly calendar
   - Curriculum calendar
   - Pay period calendar
   - Front Desk Calendar
   - Staff yearly calendar

5. **Desktop & Platform Access** (~30 items)
   - Google Docs Folders: 2025 Rates
   - Google Docs Folders: Daily Forms
   - Google Docs Folders: Licensing
   - Tadpoles
   - IKS
   - Indeed
   - Brivo door codes
   - Licensing standards
   - Bright Beginnings Website
   - Facebook pages (4 locations)
   - Zoom
   - Canva templates (Fliers, Staff Appreciation, Closure Notices, etc.)
   - Grok/ChatGPT
   - Central registry portal
   - FieldPrint Fingerprints
   - Out of State background checks
   - Maintenance form
   - Sam's, Walmart accounts
   - Outlook email
   - ProCare
   - Phone apps: Site email, Tadpoles, GroupMe, ProCare Check-in

6. **Director Daily Routine** (~45 items)
   - Director Workbook
   - Current roll call sheet printed
   - Review roll call sheets for move up
   - Know openings to staff and to capacity
   - Call out and RTO policy
   - Check emails and voicemails
   - AM message start and adjustments
   - Walk around with AM message by 9:00
   - Morning Message fully edited daily
   - Child absences call by 10:00 am
   - Desk coverage mandatory
   - Disney approach (7:30-8:30 and 4:30-5:30)
   - Arrival pattern followed
   - Ratios tracked via Tadpoles
   - Utilize extended ratios
   - Clock in staff only when ratios warrant
   - Director Subbing protocols
   - Directors not to sub unless necessary
   - Directors stay at home-base school
   - Maintain sub-list
   - Staff shortage alert policy
   - Staff late policy and write-ups
   - Staff absentees and tardiness tracked
   - Program/curriculum starts at 8:30 am
   - Teacher 1 and Teacher 2 schedules
   - Buggy schedule followed daily
   - Bookmobile schedule
   - Outdoor schedules followed
   - How to combine rooms
   - Manage ratios
   - Breaks adhered to per schedule
   - Nap rooms combined per ratios
   - Classroom support observations
   - Monitor schedules and OT
   - 2 hours minimum enrollment marketing
   - Other marketing: yard signs, flyers
   - _(continues for ~45 total items)_

7. **Special Procedures** (~12 items)
   - Tours
   - Enrollment process
   - Billing audits
   - Staff evaluations
   - Parent communication protocols
   - Emergency procedures
   - _(etc.)_

8. **Infant Care** (~10 items)
   - Diapering procedures (multiple sub-items)
   - Handwashing
   - Bottles
   - Formula vs breast milk
   - Safe sleep policies
   - Opening checklist
   - Closing checklist
   - Tadpoles documentation

9. **Children Files & Communication** (5 items)
   - Complete file
   - Medication
   - Sunscreen form
   - Daily communication
   - Tadpoles

10. **ProCare Admin** (~30 items)
    - Reports
    - ProCare University training
    - Hands-on test
    - Adding family and child data
    - Entering all data
    - Transfer from LineLeader
    - Set up billing boxes and schedules
    - Payment methods (Tuition Express, ACH, CC)
    - Agency Payments (DSS, CCA, Foster)
    - Code children with discounts
    - Upload Documents
    - Add late fees
    - Billing and charging third parties
    - Audits (billing box audit)
    - Tuition sheets
    - Re-reg fees
    - Enhancement fees
    - _(etc.)_

11. **ProCare Staff Management** (~15 items)
    - Adding employee data and picture
    - Background Checks: Fingerprints, Central Registry, Out of State
    - Sworn Statements
    - Upload training docs (Better Kid Care, VA Preservice, etc.)
    - TB Screening
    - Contract
    - W4 and direct deposit upload
    - Enter employee hours
    - Brivo access

12. **Financial Reports & Licensing** (~15 items)
    - Read tuition sheets and policies
    - Roll call sheets (Youngest to oldest)
    - Children without Contract Billing
    - Account Aging/Bad Debt
    - Billing correct rates
    - Understand birthdates and move ups
    - Discounts
    - Teacher children billing
    - Bad debts tracking
    - Licensing file procedures
    - Unannounced inspection protocol
    - Monitoring/renewal procedures
    - Parent complaint procedures
    - Tour licensing questions
    - Licensing matrix accountability

---

## UI Components

### Main Page Component
`src/pages/Competencies.jsx`

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│  Header (existing ModuleLayout component)              │
├─────┬──────────────────────────────────────────────────┤
│     │  Competency Tracker                              │
│  S  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 78%            │
│  I  │                                                   │
│  D  │  [Print View]  [Reset All] (right-aligned)      │
│  E  │                                                   │
│  B  │  ▼ Organization Chart          4/6 complete      │
│  A  │     ☑ Accountability/communication chart         │
│  R  │        ✓ Introduced: 5/12/26  ✓ Completed: 5/19  │
│     │     ☑ Individual roles and responsibilities      │
│     │        ✓ Introduced: 5/12/26  ✓ Completed: 5/20  │
│     │     ☐ Director job description                   │
│     │        [Mark Introduced] [Mark Completed—locked] │
│     │     ☐ Finance job description                    │
│     │     ...                                           │
│     │                                                   │
│     │  ▼ Calendars                   2/5 complete      │
│     │     ☑ Family yearly calendar                     │
│     │     ☐ Curriculum calendar                        │
│     │     ...                                           │
│     │                                                   │
│     │  ▶ Desktop & Platform Access   0/30              │
│     │  ▶ Director Daily Routine      3/45              │
│     │  ...                                              │
└─────┴──────────────────────────────────────────────────┘
```

**Visual Treatment:**
- Overall progress bar at top (same style as module progress bars)
- Category accordions (click to expand/collapse)
- Each category header shows completion fraction (e.g., "4/6 complete")
- Category header turns coral (`--bb-coral`) when 100% complete
- Items have two states:
  - **Not started:** Gray checkbox, "Mark Introduced" button enabled
  - **Introduced only:** Green checkbox for "Introduced", gray checkbox for "Completed", date shown, "Mark Completed" button enabled
  - **Fully completed:** Both checkboxes green, both dates shown, light green background tint

### Item Row Component
`src/components/competencies/CompetencyItem.jsx`

```jsx
// Pseudo-structure
<div className="competency-item">
  <div className="checkbox-group">
    <Checkbox 
      checked={item.introduced} 
      label="Introduced"
      date={item.introducedDate}
    />
    <Checkbox 
      checked={item.completed}
      disabled={!item.introduced}
      label="Completed"
      date={item.completedDate}
    />
  </div>
  <div className="item-label">
    {item.label}
  </div>
  <div className="actions">
    {!item.introduced && (
      <Button size="small" onClick={handleMarkIntroduced}>
        Mark Introduced
      </Button>
    )}
    {item.introduced && !item.completed && (
      <Button size="small" variant="coral" onClick={handleMarkCompleted}>
        Mark Completed
      </Button>
    )}
  </div>
</div>
```

### Category Accordion Component
`src/components/competencies/CategoryAccordion.jsx`

- Collapsible header with chevron icon
- Shows completion count (e.g., "4/6 complete")
- Auto-expands first category on page load
- Remembers expansion state in component state (not persisted)

### Print View
- Separate route `/competencies/print` or modal overlay
- Clean, printer-friendly layout:
  - No sidebar
  - No interactive elements
  - All categories expanded
  - Checkboxes rendered as ☑/☐ characters
  - Dates shown inline
  - Director name and location from user context at top
  - Timestamp of export
- Use `@media print` CSS or `window.print()` JavaScript

---

## Functionality

### Core Actions

1. **Mark Introduced**
   - Sets `introduced: true` and `introducedDate: ISO timestamp`
   - Unlocks the "Completed" checkbox
   - Updates localStorage immediately
   - Re-calculates category and overall progress

2. **Mark Completed**
   - Only enabled if `introduced === true`
   - Sets `completed: true` and `completedDate: ISO timestamp`
   - Updates localStorage immediately
   - Re-calculates category and overall progress

3. **Uncheck** (optional — include or skip based on your preference)
   - Click a checked box to uncheck it
   - If unchecking "Introduced", also unchecks "Completed" (cascade)
   - Nulls the corresponding date field
   - **Recommendation:** Include this for flexibility, but add a confirmation modal if unchecking a completed item

4. **Reset All** (admin function)
   - Button in top-right corner
   - Shows confirmation modal: "Are you sure? This will clear all competency progress."
   - On confirm: clears `bb-director-competencies` from localStorage
   - Useful for testing or if a director leaves and a new one starts on the same device

### Progress Calculation

```js
// Overall progress
const totalItems = allCategories.flatMap(c => c.items).length;
const completedItems = Object.values(competencyData.items)
  .filter(item => item.completed).length;
const overallPct = Math.round((completedItems / totalItems) * 100);

// Category progress
const categoryItems = category.items.length;
const categoryCompleted = category.items.filter(item => 
  competencyData.items[item.id]?.completed
).length;
const categoryPct = Math.round((categoryCompleted / categoryItems) * 100);
```

### Print View

**Option A:** New route `/competencies/print`
- Link/button says "Print View"
- Opens in new tab or same tab
- User hits browser print (Ctrl+P / Cmd+P)
- CSS hides non-essential elements

**Option B:** Modal overlay
- Click "Print View" → full-screen modal
- Modal contains print-formatted content
- "Print" button in modal triggers `window.print()`
- Close button returns to tracker

**Recommendation:** Option A (cleaner separation, easier to style)

---

## Utility Functions

Create `src/utils/competencyTracker.js` with the following helpers:

```js
// Load competency data from localStorage
export function loadCompetencies() {
  const stored = localStorage.getItem('bb-director-competencies');
  if (!stored) return initializeCompetencies();
  return JSON.parse(stored);
}

// Initialize empty competency structure
export function initializeCompetencies() {
  const items = {};
  CATEGORIES.forEach(category => {
    category.items.forEach(item => {
      items[item.id] = {
        id: item.id,
        categoryId: category.id,
        introduced: false,
        introducedDate: null,
        completed: false,
        completedDate: null
      };
    });
  });
  
  const data = {
    lastUpdated: new Date().toISOString(),
    items
  };
  
  saveCompetencies(data);
  return data;
}

// Save competency data to localStorage
export function saveCompetencies(data) {
  data.lastUpdated = new Date().toISOString();
  localStorage.setItem('bb-director-competencies', JSON.stringify(data));
}

// Mark item as introduced
export function markIntroduced(data, itemId) {
  data.items[itemId].introduced = true;
  data.items[itemId].introducedDate = new Date().toISOString();
  saveCompetencies(data);
  return data;
}

// Mark item as completed
export function markCompleted(data, itemId) {
  data.items[itemId].completed = true;
  data.items[itemId].completedDate = new Date().toISOString();
  saveCompetencies(data);
  return data;
}

// Uncheck introduced (and cascade to completed if needed)
export function uncheckIntroduced(data, itemId) {
  data.items[itemId].introduced = false;
  data.items[itemId].introducedDate = null;
  data.items[itemId].completed = false;
  data.items[itemId].completedDate = null;
  saveCompetencies(data);
  return data;
}

// Uncheck completed only
export function uncheckCompleted(data, itemId) {
  data.items[itemId].completed = false;
  data.items[itemId].completedDate = null;
  saveCompetencies(data);
  return data;
}

// Calculate overall progress
export function getOverallProgress(data) {
  const total = Object.keys(data.items).length;
  const completed = Object.values(data.items).filter(i => i.completed).length;
  return Math.round((completed / total) * 100);
}

// Calculate category progress
export function getCategoryProgress(data, categoryId) {
  const categoryItems = Object.values(data.items)
    .filter(i => i.categoryId === categoryId);
  const completed = categoryItems.filter(i => i.completed).length;
  return {
    total: categoryItems.length,
    completed,
    pct: Math.round((completed / categoryItems.length) * 100)
  };
}

// Reset all competencies
export function resetAllCompetencies() {
  localStorage.removeItem('bb-director-competencies');
  return initializeCompetencies();
}
```

---

## Styling

### CSS Module (`Competencies.module.css`)

Use existing design tokens from `variables.css`:

```css
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  color: var(--bb-coral);
}

.progressBar {
  /* Use existing ProgressBar component */
  margin-bottom: 1.5rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

.categoryAccordion {
  background: var(--bb-off-white);
  border: 1px solid var(--bb-light-gray);
  border-radius: var(--card-radius);
  margin-bottom: 1rem;
}

.categoryHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  cursor: pointer;
  transition: var(--transition);
}

.categoryHeader:hover {
  background: rgba(240, 135, 130, 0.1); /* coral tint */
}

.categoryHeaderComplete {
  background: rgba(76, 175, 130, 0.15); /* green tint */
  border-left: 4px solid var(--bb-green);
}

.categoryTitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--bb-charcoal);
}

.categoryProgress {
  font-size: 0.9rem;
  color: var(--bb-mid-gray);
  font-weight: 500;
}

.categoryProgressComplete {
  color: var(--bb-green);
  font-weight: 600;
}

.itemsList {
  padding: 0 1.25rem 1.25rem;
  border-top: 1px solid var(--bb-light-gray);
}

.competencyItem {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.competencyItem:last-child {
  border-bottom: none;
}

.competencyItemComplete {
  background: rgba(76, 175, 130, 0.08);
  padding: 1rem;
  border-radius: 8px;
  border-bottom: none;
}

.checkboxGroup {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.checkboxLabel {
  font-weight: 500;
  color: var(--bb-charcoal);
}

.checkboxDate {
  font-size: 0.75rem;
  color: var(--bb-mid-gray);
  margin-left: 0.25rem;
}

.itemLabel {
  font-size: 1rem;
  color: var(--bb-charcoal);
}

.itemActions {
  display: flex;
  gap: 0.5rem;
}

/* Print styles */
@media print {
  .actions,
  .itemActions {
    display: none;
  }
  
  .categoryAccordion {
    page-break-inside: avoid;
  }
  
  .categoryHeader {
    cursor: default;
  }
}
```

---

## Integration Checklist

### File Creation
- [ ] `src/data/competenciesData.js` — category and item definitions
- [ ] `src/utils/competencyTracker.js` — localStorage CRUD functions
- [ ] `src/pages/Competencies.jsx` — main page component
- [ ] `src/pages/Competencies.module.css` — page styles
- [ ] `src/components/competencies/CategoryAccordion.jsx` — accordion component
- [ ] `src/components/competencies/CompetencyItem.jsx` — item row component
- [ ] `src/pages/CompetenciesPrint.jsx` (optional) — print view

### App.jsx Updates
- [ ] Add route: `<Route path="/competencies" element={<Competencies />} />`
- [ ] Add route: `<Route path="/competencies/print" element={<CompetenciesPrint />} />` (if using separate print page)
- [ ] Import new components

### Sidebar.jsx Updates
- [ ] Add "Competency Tracker" link after "Daily Brief"
- [ ] Add icon: 📋
- [ ] Add completion badge showing % when > 0%

### Dashboard.jsx Updates (optional Phase 1.5)
- [ ] Add "Track Your Skills" card
- [ ] Show overall % and CTA
- [ ] Link to `/competencies`

### Testing Checklist
- [ ] localStorage initialization on first visit
- [ ] Mark Introduced → unlocks Completed
- [ ] Mark Completed → updates progress bars
- [ ] Uncheck cascades correctly (Introduced → also unchecks Completed)
- [ ] Category progress calculation accurate
- [ ] Overall progress calculation accurate
- [ ] Print view renders correctly
- [ ] Reset All clears data and re-initializes
- [ ] Sidebar badge shows correct %
- [ ] Works on mobile (responsive accordion)

---

## Content Mapping Notes

The original PDF has some structural quirks to handle:

1. **"Organization Chart" appears twice:**
   - As a top-level item under "Foundation"
   - As a category header with 6 sub-items
   - **Solution:** Treat "Organization Chart" as a category only; move its checkbox item to "Foundation" or rename it "Organization Chart Overview"

2. **Nested items (e.g., Job Descriptions by Position):**
   - Original has: "Job descriptions by position" with indented sub-items (Director, Finance, Admin, Maintenance)
   - **Solution:** Flatten to 4 separate items in the "Organization Chart" category

3. **Multi-column checkboxes in original (Introduced / Completed):**
   - Already handled by our data model

4. **Items without clear category boundaries:**
   - Group logically (e.g., all ProCare items under "ProCare Admin" and "ProCare Staff Management")

5. **Assistant Director section:**
   - This appears near the end of the original document as a separate section
   - **Solution:** Create "Assistant Director Responsibilities" category (optional — or fold into "Director Daily Routine")

---

## Future Enhancements (Post-Phase 1)

These are **NOT** part of the initial build but good to document for future work:

1. **Module-to-Competency Auto-Unlock (Option 3):**
   - When director completes Module 1, auto-check certain competencies
   - Requires mapping table in `competenciesData.js`

2. **Trainer Review Portal:**
   - Admin dashboard section showing all directors' competency progress
   - Trainer can approve/reject completions
   - Requires Firestore integration

3. **Evidence Upload:**
   - Directors upload screenshots/photos as proof of competency
   - Stored in Firebase Storage or base64 in Firestore

4. **Export to PDF:**
   - Generate a formatted PDF report (not just browser print)
   - Use jsPDF or similar library

5. **Competency Recommendations:**
   - Birdie AI suggests next competencies to tackle based on module progress
   - "You just finished Module 3 — time to practice diapering procedures!"

6. **6-Week Deadline Tracker:**
   - Visual timeline showing "All topics should be introduced within the first 6 weeks"
   - Calculates days remaining based on user's start date
   - Highlights overdue items in red

---

## Success Metrics

How do we know this feature is working?

1. **Adoption:** >80% of new directors use the tracker within their first week
2. **Completion:** Directors mark >50% of competencies complete by week 6
3. **Accuracy:** Trainer spot-checks during 1:1s confirm directors aren't gaming the system
4. **Efficiency:** Reduces time Rob/Nancy spend manually tracking onboarding checklists from ~2 hrs/week to <30 min/week
5. **Feedback:** Directors report it's "helpful" or "very helpful" in onboarding surveys

---

## Design Mockup (Text-Based)

```
┌─────────────────────────────────────────────────────────────────┐
│  Competency Tracker                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  156 / 200 complete (78%)                                       │
│                                                                  │
│  [Print View]  [Reset All]                         (right side) │
│                                                                  │
│  ▼ Foundation                                     4/4 complete  │
│     ✓ Attends Regional Licensing Training                       │
│        Introduced: 5/1/26  Completed: 5/3/26                    │
│     ✓ Manuals to modules                                        │
│        Introduced: 5/1/26  Completed: 5/1/26                    │
│     ✓ Organization Chart Overview                               │
│     ✓ (other foundation item)                                   │
│                                                                  │
│  ▼ Organization Chart                             4/6 complete  │
│     ✓ Accountability/communication chart                        │
│        Introduced: 5/12/26  Completed: 5/19/26                  │
│     ✓ Individual roles and responsibilities                     │
│        Introduced: 5/12/26  Completed: 5/20/26                  │
│     ☑ Director job description                                  │
│        Introduced: 5/18/26  [Mark Completed]                    │
│     ☐ Finance job description                                   │
│        [Mark Introduced]                                        │
│     ☐ Administration job description                            │
│     ☐ Maintenance job description                               │
│                                                                  │
│  ▶ Meetings                                       0/2           │
│  ▶ Calendars                                      2/5           │
│  ▶ Desktop & Platform Access                     5/30          │
│  ▶ Director Daily Routine                        12/45         │
│  ...                                                             │
└──────────────────────────────────────────────────────────────────┘
```

---

## Questions for Rob Before Building

1. **Uncheck behavior:** Should directors be able to uncheck items (to fix mistakes), or should items be "check-only" once marked?

2. **Reset All vs. Reset Category:** Do you want a "Reset All" button, or also category-level resets?

3. **Print layout:** Preference for new route vs. modal overlay for print view?

4. **Sidebar badge:** Show completion % in sidebar next to "Competency Tracker" link? (e.g., "Competency Tracker 78%")

5. **First-time UX:** Should we show an intro modal on first visit explaining how the tracker works?

6. **Competency order:** Should categories be collapsible by default (all closed except first), or all open on load?

7. **Mobile considerations:** Accordion works well on mobile, but do directors primarily use desktop for training app?

---

## Ready to Build

This prompt contains everything needed to implement Option 2. Next steps:

1. Review and approve this prompt
2. Create `competenciesData.js` with full ~200 item list (this will take ~30 min to structure)
3. Build components and integrate into app
4. Test on localhost
5. Deploy to Netlify

Estimated build time: **4-6 hours** (including data structuring, component creation, styling, and testing)

---

**End of Prompt**
