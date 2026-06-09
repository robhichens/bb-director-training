# BB Director Training — Course-Wide Content Audit

**Scope:** All 7 modules (`src/modules/module1–7/content.json`) — every reading, quiz, and scenario.
**Method:** Internal-consistency + grounding review. Each quiz answer checked against its section's reading and against the rest of the course; numbers/policies cross-checked across modules.
**Status:** Pass 1 applied (see Update Log). Remaining items still open.

---

## Update Log

**Pass 1 — applied & deployed to both apps (training + manual):**

- ✅ **P1 credentials removed** — Canva login/password (`6.4-quiz` q7, `7.2`) and voicemail PIN (`7.1`, `7.2`). ⚠️ **You must still rotate the Canva password** — it shipped in prior bundles and is in git history.
- ✅ **C2** Crozet target 72 → **120** (`4.1-quiz` q5)
- ✅ **C3** Forest Lakes Merchant ID 7657 → **7660** (`4.6-quiz` q6)
- ✅ **C4** Crozet CCA code 9304 → **9252** (`4.6-quiz` q9)
- ✅ **X1/X2** Collections → **Day 5 deny-care**; billing cycle stated as **due 1st / late 5th / charged 27th** (`4.2` reading + activity)
- ✅ **X3** DOR (daily) vs **WOR (Friday 3 PM)** split (`2.6`, `7.5`)
- ✅ **X4** Medication → staff give **only inhalers/EpiPens (MAT-trained)**; **parents handle OTC** (`5.2` reading + quiz)
- ✅ **Licensing authority** standardized **VDSS → VDOE** (`4.5`, `5.x`, `7.1`)

**Still open (need your decision or source):** X5 (strep return), X6 (ratio age-bands — needs VDOE numbers), X7 (Day-1 onboarding), X8 (binder Day 3 vs 16), X9 (tour "target room first"); the low-risk standardizations X10/X11/X12; all of **P3** (replace ungrounded questions — incl. the approved `1.1-quiz` q7–q9), **P4** (verify-with-source facts), and **P5** (duplicate questions, typo, emoji).

---

## How to read this

Findings are bucketed by what kind of problem they are — which determines who can fix them:

- **🔴 P1 — Critical:** wrong info a director would memorize, or exposed credentials. Fix ASAP.
- **🟠 P2 — Contradictions:** the course disagrees with itself. A clear fix usually exists; a few need you to pick the right version.
- **🟡 P3 — Ungrounded / misplaced questions:** the question tests something its section never teaches (often taught in a *later* section).
- **🔵 P4 — Verify with source:** facts I can't confirm without your real BB/Virginia docs. I can flag; only you can confirm.
- **⚪ P5 — Quality:** duplicate questions, a typo, aging phrasing.

> **Important caveat:** I can fully audit *internal* correctness (does the course agree with itself? is each question answerable from the material?). I **cannot** verify *external* correctness — whether a number matches real Bright Beginnings policy or current Virginia law. Everything in P4 needs your eyes.

---

## Executive summary

The good news: the teaching is strong and the scenarios are excellent. The problems cluster in the **quizzes** and in a few **cross-section policy conflicts** — exactly the two failure modes we already found in Module 1.

Headline issues:

1. **🔴 Exposed credentials.** The Canva login **and password** (`BBIteach1984!`) are written in plaintext in **Module 6 quiz** and **Module 7 reading**. The HQ voicemail password (`1984`) is also in Module 7. All `content.json` ships to the browser, so anyone using the app can read them.
2. **🔴 The Crozet "72" bug also lives in Module 4** (`4.1-quiz` q5) — same error we just fixed in Module 1. Correct = **120**.
3. **🔴 Two billing answer keys teach the wrong codes** (`4.6-quiz` q6 and q9) — a director memorizing them would use the wrong Merchant ID and CCA code, causing real billing errors.
4. **🟠 Several policy contradictions** across sections: the collections/deny-care timeline, the billing cycle, the DOR vs WOR deadline, the medication (OTC) policy, and the staff ratios.
5. **🟡 A systemic pattern:** many quizzes test content from a *later* section, so learners hit questions before they've read the answer.
6. **🔵 The Virginia licensing authority is named inconsistently** (VDSS vs VDOE; Title 22 vs 8VAC20-780). The course straddles the 2021 regulatory transition. Needs standardizing.

Rough counts: **4 critical**, **~11 contradictions**, **~10 ungrounded/misplaced**, **~14 verify-with-source**, **~12 quality (mostly duplicate questions).**

---

## 🔴 P1 — Critical

| ID | Location | Problem | Fix |
|----|----------|---------|-----|
| **C1** | `6.4-quiz` q7 *explanation*; `7.2` reading | **Live Canva password in plaintext:** `mollypetchel@gmail.com / BBIteach1984!`. Ships to every browser via `content.json`. | Remove the password from content. **Rotate the Canva password** (treat as compromised). Replace the quiz question or have it reference "see the laminated card / ask admin." |
| **C1b** | `7.1`, `7.2` reading | **HQ voicemail password `1984`** in plaintext (also lots of vendor names/phones, `robhichens84@gmail.com`). | At minimum move credentials out of shipped content. Consider whether the vendor directory should live behind admin auth rather than in the training bundle. |
| **C2** | `4.1-quiz` q5 explanation | "**Crozet targets 72**." Wrong — same bug we fixed in Module 1. Reading + q1 say **120** (85% of 141). | Change 72 → **120**. |
| **C3** | `4.6-quiz` q6 | "Forest Lakes Merchant ID" keyed to **7657** — that's *Crozet's*. Reading + Module 7 say FL = **7660**. Explanation is garbled ("CR-7657… FL-7660 reversed in some docs…"). | Answer → **7660**; rewrite the explanation cleanly. |
| **C4** | `4.6-quiz` q9 | "Crozet CCA code" keyed to **9304** — that's *Mill Creek's*. Reading + Module 7 say Crozet = **9252**. Explanation also scrambled. | Answer → **9252**; rewrite the explanation. |

> Authoritative billing reference (Module 7 `7.3`, matches `4.6` reading): **Crozet** TE 7657 / CCA 9252 · **Forest Lakes** TE 7660 / CCA 2935 · **Mill Creek** TE 7673 / CCA 9304.

---

## 🟠 P2 — Contradictions (course disagrees with itself)

| ID | Where | The conflict | Suggested resolution |
|----|-------|--------------|----------------------|
| **X1 — Deny-care timeline** | `4.2` reading vs `4.1-quiz` q7 / `4.5` reading | 4.2 says **suspend Day 11, terminate Day 15**. But 4.1-quiz q7 and 4.5 say **deny care on Day 5**. | Pick one timeline and make every section match. (Likely: Day 5 = balance due/last reminder; suspension later — but you decide.) |
| **X2 — Billing cycle** | `4.2` vs `4.5`/`4.6` | 4.2: tuition **due the 1st, late fee the 5th**. 4.5/4.6: tuition **posted Day 23, auto-charged Day 27 (Billing Day), late fees Day 1**. Two different cycles coexist. | Clarify the real cycle and reconcile the late-fee timing across all sections. |
| **X3 — DOR vs WOR deadline** | `2.1`/`4.3`/`1.3` vs `2.6`/`7.5` | DOR is described as a **daily, end-of-day** report — but 2.6 and the 7.5 checklist say "**DOR and WOR by Friday 3 PM**." | Almost certainly: **DOR = daily**, **WOR = Friday 3 PM**. Remove "DOR" from the Friday-3 PM phrasing. |
| **X4 — Medication / OTC policy** | `5.2` reading + `5.2-quiz` q4 vs `5.5` reading + `5.5-quiz` q3/q8 | 5.2: OTC meds (incl. vitamins) **may be given** with a signed MAF + doctor's note. 5.5: **ONLY** prescription inhalers + EpiPens — **no OTC ever**. Direct contradiction on a safety policy. | Decide the real policy and rewrite the losing side. (This one matters — it's medication.) |
| **X5 — Strep / illness return** | `5.2` reading vs `5.2-quiz` q5 | Reading: diagnosed contagious illness needs a **doctor's note** to return. q5: strep can return after **48 hrs on antibiotics, no note**, and marks "needs a note" *wrong*. | Reconcile the return-to-care rule. |
| **X6 — Staff ratios / age bands** | `3.2` reading vs `3.2-quiz` q5 & q7 | Reading bands: 0–12 mo 1:4, 12–24 mo 1:5, …4–5 yr 1:12. q5 says "**under 16 months** = 1:4"; q7 says "**3–4 year olds** = 1:10" (reading puts 4-yr-olds at 1:12). | Align the age bands. **Also verify against current VDOE 8VAC20-780** (P4) — ratios are licensing-critical. |
| **X7 — Day 1 onboarding** | `3.1` reading vs `3.1-quiz` q6 | Reading Day 1 = handbook review, tour, shadow. q6 keys the answer to "**state orientation hours + paperwork**" and marks "handbook review" *wrong*. | Reconcile what Day 1 actually is. |
| **X8 — Binder review day** | `5.1` reading + `4.4` (Day 16 full review) vs `4.5` + `5.1-quiz` q9 (Day 3) | Is the binder reviewed **Day 3** or **Day 16**? q9 says Day 3 while its own section reading says Day 16. | Clarify (maybe Day 3 quick-check + Day 16 full review — but say so consistently). |
| **X9 — Tour "target room first"** | `2.4` reading vs `2.5-quiz` q7 | 2.4 tour flow: lobby → office chat → **all** classrooms (Step 3). q7 says show the **target classroom first** and marks other answers wrong. | Reconcile with the documented 5-step tour. |
| **X10 — Audit report name** | `4.3-quiz` q5 ("**Financial** Audit") vs `4.5`/`7.3` ("**Billing** Audit") | Same Day-20 report, two names. | Standardize to one name. |
| **X11 — Wed OT threshold** | `2.3-quiz` q8 ("32+ hrs") vs `2.6`/`7.3` ("35 hrs") | Minor numeric mismatch for the Wednesday overtime check. | Pick one number. |
| **X12 — Tour follow-up Day 2 vs 3** | `2.4` table ("Day 2") vs `2.5-quiz` q6 ("Day 3") | Minor; the follow-up cadence disagrees by a day. | Align. |

---

## 🟡 P3 — Ungrounded / misplaced questions

These test real, valid content — but not from the section the quiz belongs to (usually it's taught in a *later* section, so the learner hasn't read it yet).

| Where | Tests… | Actually taught in |
|-------|--------|--------------------|
| `1.1-quiz` q7, q8, q9 | cell phones / art labeling / Tadpoles photos | **1.5 & 1.6** (you already approved replacing these) |
| `1.1-quiz` q2, q10 | director floor-presence | 1.5 (minor — thematically OK) |
| `1.4-quiz` q9 | the **Career Ladder** progression | not in 1.4 at all — it's Module 3 content |
| `2.1-quiz` q9 | **fire-drill frequency** | not in 2.1 — Module 5 |
| `2.1-quiz` q5 | monthly voicemail update | not in 2.1 — Module 4/7 |
| `2.5-quiz` q5, q8, q9 | lifetime value, phone script, price-on-phone | **2.7** (a later section) |
| `3.1-quiz` q7, q8 | licensing-file split, Day-1/7/20/30/60/90 cadence | **3.5** |
| `4.3-quiz` q5, q7, q8 | Day-20 / Day-2 / Day-6 calendar tasks | **4.5** |
| `4.4-quiz` q5 | Warrant in Debt | **4.6** |
| `5.2-quiz` q9 | **sunscreen** authorization | not found in any reading |
| `5.4-quiz` q7 | indoor/outdoor **square footage** | not in any reading |

**Systemic note:** the "quiz tests later-section content" pattern repeats in almost every module. Two clean ways to fix it long-term: (a) move each question into the quiz for the section that teaches it, or (b) reorder sections so content precedes its quiz. For now, the targeted fix is to replace the worst offenders with questions grounded in their own section (as we're doing for 1.1).

---

## 🔵 P4 — Verify with source (needs your BB / Virginia docs)

| Item | Where | What to confirm |
|------|-------|-----------------|
| **Licensing authority name** | Module 3 = "VDOE"; Module 5 & 7 = "VDSS"; 7.2 links both "Title 22" and "8VAC20-780" | VA childcare licensing moved **VDSS → VDOE** in 2021; standards are **8VAC20-780** (Title 22 / 22VAC40-185 is the old VDSS version). Pick the current framework and standardize everywhere. |
| **Staff ratios + age bands** | `3.2` | Confirm exact current VDOE ratios and the age boundaries (12 vs 16 months, 4-yr-olds 1:10 vs 1:12). |
| **Minimum wage $12.71/hr** | `3.4`, `3.6` | Confirm current VA figure (it changes yearly — will go stale). |
| **"<2 weeks notice → minimum wage"** | `3.4`, `3.6` | Flagging for **admin/legal review** — I'm not offering a legal opinion, but a wage-reduction-on-notice policy is worth confirming is lawful and current. |
| **Training-cost deductions** ($75/$150/$200) | `3.4`, `3.6` | Confirm amounts + the tenure window. |
| **Indoor/outdoor sq ft** (35 / 75) | `5.4-quiz` q7 | Confirm against VDOE. |
| **Bleach ppm values** | `5.5` | Confirm against current health guidance. |
| **Field-trip reg subsection** `8VAC20-780-580` | `5.7` | Confirm the exact subsection number. |
| **Illness exclusion specifics** (100.4°F, 48-hr antibiotic, etc.) | `5.2` | Confirm against your current policy. |
| **Drill frequencies** (fire monthly, lockdown quarterly) | `5.4` | Confirm VA requirement. |
| **Warrant in Debt** ($5,000, Albemarle GDC) | `4.4`, `4.6` | Confirm threshold + venue. |
| **Vendor directory** (names, phone numbers) | `7.1` | Confirm all contacts/numbers are current. |
| **Maintenance intake email** `robhichens84@gmail.com` | `2.6`, `2.3-quiz` q5, `7.5` | Confirm this is the right address (it's a personal-style Gmail; consistent across the course). |
| **"41 years / since 1984"** | `1.4`, `2.4`, `2.7` | Internally consistent, but hard-coded — it will age. Consider a review date or dynamic phrasing. |

---

## ⚪ P5 — Quality (duplicates, typo, style)

**Duplicate / near-duplicate questions** (same fact asked twice in one quiz — recommend replacing one of each pair):

- `3.2-quiz` q4 = q8 (cross-training — *identical*)
- `4.4-quiz` q4 = q8 (Day-26 blitz — *identical*); q3 ≈ q6 (Director Packet weekly)
- `6.1-quiz` q3 = q8 (referral timing), q4 = q7 (minor-fall call), q2 ≈ q9 (1-hour rule)
- `6.4-quiz` q3 = q10 (pediatrician partnership)
- `6.5-quiz` q2 = q9 (event sign-in), q1 ≈ q5 (peak months), q4 ≈ q6 (transition letter)
- `5.7-quiz` q3 ≈ q7 (bus min 4), q1 ≈ q6 (verbal permission)

**Other:**

- **Emoji in content:** `1.2` reading uses a "⚠️" character in the cost-reminder callout — against the Tabler-icons-only rule (it's body text, but worth removing for consistency).
- **Typo:** `2.5` title — "Four Steps to **a** Enrolled Family" → "**an** Enrolled Family."
- **Operational PII in shipped content** (named staff/owners, phone numbers) — lower-sensitivity than the passwords in P1, but note it all ships to the browser.

---

## Recommended fix sequence

1. **P1 first (today):** I remove the credentials from `content.json` (Modules 6 & 7); you **rotate** the Canva and voicemail passwords. Then fix C2/C3/C4 (Crozet 120, Merchant ID, CCA code).
2. **P2 contradictions:** I can auto-fix the ones with a clear authoritative source (X3 DOR/WOR, X10 audit name, X11 hours, X12 day, and C-grade billing codes). The policy ones — **X1 deny-care, X2 billing cycle, X4 medication/OTC, X6 ratios, X5/X7/X8/X9** — need you to tell me the correct version.
3. **P3:** replace the worst ungrounded questions (starting with 1.1 q7–q9, already approved) with section-grounded ones.
4. **P4:** you confirm the external facts; I update text + standardize VDOE/8VAC20-780.
5. **P5:** I de-dupe quizzes, fix the typo and emoji.

**Every fix also gets mirrored into the bb-platform manual copy** (`bb-platform/src/data/manual/`), as we did for the Crozet fix.

---

### Quick decisions I need from you to start P2

- **Deny care:** Day 5, or Day 11 (with Day 15 termination)?
- **Billing cycle:** due-1st/late-5th, or posted-23/charged-27? (or both, for different things?)
- **OTC medication:** allowed with MAF + doctor's note, or inhaler/EpiPen only?
- **Licensing body:** standardize to **VDOE / 8VAC20-780** (current), yes?

Tell me those four and I can clear most of P1–P2 in one pass.
