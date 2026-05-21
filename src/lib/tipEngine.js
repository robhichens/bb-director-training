/**
 * tipEngine.js — Daily Brief tip library
 *
 * Each tip:
 *   id           – unique string
 *   section      – 'rightNow' | 'today' | 'thisMonth' | 'thisSeason'
 *   category     – label string
 *   urgency      – 'high' | 'medium' | 'low'
 *   title        – short headline (emoji prefix encouraged)
 *   body         – 1–3 sentence detail
 *   birdiePrompt – pre-filled question sent to Birdie
 *   triggers     – ONE of:
 *       { timeStart: 7, timeEnd: 9 }   decimal hours (local)
 *       { days: [1,2] }                0=Sun … 6=Sat
 *       { dates: [27] }                day-of-month 1–31
 *       { months: [6] }                1–12
 *       { always: true, rotateIndex: 0 } rotate by dayOfYear % 4
 */

const TIPS = [
  // ── RIGHT NOW — time-based ────────────────────────────────────────────
  {
    id: 'dropoff-floor',
    section: 'rightNow',
    category: 'Operations',
    urgency: 'high',
    title: '🚸 Drop-off: be on the floor',
    body: 'Directors should be visible and greeting families during drop-off. Your presence sets the tone for the entire day and catches anything unusual before it escalates.',
    birdiePrompt: 'What are the most important things for a director to do during morning drop-off?',
    triggers: { timeStart: 7, timeEnd: 9.25 },
  },
  {
    id: 'bleach-bottles',
    section: 'rightNow',
    category: 'Health & Safety',
    urgency: 'high',
    title: '🧴 Mix fresh bleach solution',
    body: 'Bleach solution must be mixed fresh daily — it loses potency within 24 hours. Use 1 tablespoon bleach per quart of water for surfaces, or the appropriate concentration for the use case.',
    birdiePrompt: 'What are the correct bleach concentrations for the six different sanitizing uses at Bright Beginnings?',
    triggers: { timeStart: 6, timeEnd: 9 },
  },
  {
    id: 'tadpoles-am-message',
    section: 'rightNow',
    category: 'Communications',
    urgency: 'medium',
    title: '📲 Send Tadpoles AM message',
    body: 'The AM parent message should go out by 9:15 AM. A cheerful update — today\'s weather, what\'s planned, a quick warm thought — builds trust and reduces call volume.',
    birdiePrompt: 'Can you give me 3 examples of a warm, engaging Tadpoles morning message for parents?',
    triggers: { timeStart: 7, timeEnd: 9.25 },
  },
  {
    id: 'tour-prep',
    section: 'rightNow',
    category: 'Enrollment',
    urgency: 'medium',
    title: '🏫 Tour prep — check the lobby',
    body: 'Prospective families often arrive right at opening. Walk the lobby: postings current, décor inviting, no stray items on doors or walls without approval. First impressions convert.',
    birdiePrompt: 'What should be posted in the lobby per Bright Beginnings standards, and what should never be on classroom doors?',
    triggers: { timeStart: 9, timeEnd: 9.5 },
  },
  {
    id: 'afternoon-rounds',
    section: 'rightNow',
    category: 'Operations',
    urgency: 'medium',
    title: '🔍 Afternoon rounds & Tadpoles check',
    body: 'Walk each classroom between 1–3 PM. Verify nap blinds are UP and lights ON. Check that each teacher has uploaded 2 staged Tadpoles photos with 2-sentence captions — due by 3 PM.',
    birdiePrompt: 'What are the Tadpoles photo standards teachers must follow, and how should I address a teacher who consistently misses them?',
    triggers: { timeStart: 13, timeEnd: 15 },
  },
  {
    id: 'pickup-visibility',
    section: 'rightNow',
    category: 'Operations',
    urgency: 'medium',
    title: '👋 Pickup time — stay visible',
    body: 'Afternoon pickup is your highest-traffic parent touchpoint. Be in the hallway, not behind a desk. Quick conversations now prevent misunderstandings later.',
    birdiePrompt: 'What are the best ways to handle parent concerns during afternoon pickup without disrupting operations?',
    triggers: { timeStart: 15, timeEnd: 18 },
  },
  {
    id: 'dor-before-leaving',
    section: 'rightNow',
    category: 'Documentation',
    urgency: 'high',
    title: '📋 Complete your DOR before leaving',
    body: 'The Daily Operations Report must be filed before you leave for the day — not tomorrow morning. Log any incidents, ratio issues, late pickups, or maintenance items while they\'re fresh.',
    birdiePrompt: 'What items must always be included in a Daily Operations Report?',
    triggers: { timeStart: 17, timeEnd: 20 },
  },

  // ── TODAY — day-of-week ───────────────────────────────────────────────
  {
    id: 'monday-roll-call',
    section: 'today',
    category: 'Operations',
    urgency: 'high',
    title: '📋 Monday: run ProCare roll call',
    body: 'Pull the roll-call report first thing Monday morning. Verify all enrolled children are accounted for and flag any unexpected absences or schedule changes for the week.',
    birdiePrompt: 'Walk me through running the roll call report in ProCare, including the exact menu path.',
    triggers: { days: [1] },
  },
  {
    id: 'monday-dss',
    section: 'today',
    category: 'Billing',
    urgency: 'high',
    title: '💰 Monday: check DSS portal',
    body: 'Log in to the DSS portal each Monday to check for authorizations, updates, or pending actions. Remember: as of June 2025, no new DSS enrollments without KP approval.',
    birdiePrompt: 'What should I look for when checking the DSS portal on Monday, and what\'s the current DSS enrollment policy?',
    triggers: { days: [1] },
  },
  {
    id: 'monday-aging',
    section: 'today',
    category: 'Billing',
    urgency: 'medium',
    title: '📊 Monday: pull bad-debt aging report',
    body: 'Run the aging report in ProCare: Reports > Accounting > Aging. Flag any accounts over 30 days — Day 5 is the denial-of-care deadline, so early visibility matters.',
    birdiePrompt: 'How do I pull the aging report in ProCare and what action should I take on accounts at different delinquency levels?',
    triggers: { days: [1] },
  },
  {
    id: 'tuesday-staff-matrix',
    section: 'today',
    category: 'HR',
    urgency: 'high',
    title: '👥 Tuesday: update staff matrix',
    body: 'Review and update the staffing matrix for the week. Confirm coverage for each classroom meets VA ratio requirements — infant 1:4, toddler 1:5, two\'s 1:8, preschool 1:10.',
    birdiePrompt: 'What are the Virginia licensing staff-to-child ratios for each age group, and where do I find the staffing matrix?',
    triggers: { days: [2] },
  },
  {
    id: 'tuesday-immunizations',
    section: 'today',
    category: 'Compliance',
    urgency: 'medium',
    title: '💉 Tuesday: immunization file check',
    body: 'Each Tuesday, verify new-enrollment immunization records are on file and current. ProCare path: Reports > Children > Immunization Due. Out-of-compliance families must be contacted.',
    birdiePrompt: 'What are the Virginia immunization requirements for childcare enrollment, and what do I do if a record is missing or expired?',
    triggers: { days: [2] },
  },
  {
    id: 'wednesday-maintenance',
    section: 'today',
    category: 'Facilities',
    urgency: 'high',
    title: '🔧 Wednesday: maintenance list due by 12 PM',
    body: 'Compile all maintenance needs reported this week and email the list to robhichens84@gmail.com by 12 PM today. Walk the building Wednesday morning to catch anything missed.',
    birdiePrompt: 'What should I include on the weekly maintenance list, and how should I prioritize urgent vs. non-urgent items?',
    triggers: { days: [3] },
  },
  {
    id: 'wednesday-newsletter',
    section: 'today',
    category: 'Communications',
    urgency: 'medium',
    title: '📰 Wednesday: Canva newsletter',
    body: 'Draft this week\'s parent newsletter in Canva. Log in with mollypetchel@gmail.com / BBIteach1984!. Keep it positive, highlight staff, preview upcoming events, and include any enrollment reminders.',
    birdiePrompt: 'What content should be in a preschool weekly newsletter, and what tone works best for parent communications?',
    triggers: { days: [3] },
  },
  {
    id: 'wednesday-overtime',
    section: 'today',
    category: 'HR',
    urgency: 'medium',
    title: '⏱ Wednesday: check overtime risk',
    body: 'Mid-week is the right moment to check if any staff are tracking toward overtime. ProCare: Reports > Payroll > Hours Summary. Adjust schedules now — Friday is too late.',
    birdiePrompt: 'How do I check staff hours mid-week in ProCare to prevent overtime, and what should I do if someone is already close to 40 hours?',
    triggers: { days: [3] },
  },
  {
    id: 'thursday-leadership',
    section: 'today',
    category: 'Operations',
    urgency: 'high',
    title: '🗓 Thursday: leadership meeting — mandatory',
    body: 'Leadership meeting is mandatory on Thursdays. Review the week\'s KPIs, upcoming events, staffing gaps, and any compliance items. No exceptions without prior approval from ownership.',
    birdiePrompt: 'What topics should always be on a weekly director leadership meeting agenda?',
    triggers: { days: [4] },
  },
  {
    id: 'thursday-director-packet',
    section: 'today',
    category: 'Documentation',
    urgency: 'high',
    title: '📁 Thursday: submit Director Packet',
    body: 'The Director Packet is due Thursday. Include completed DORs, incident reports, staff schedule for next week, and any licensing correspondence received this week.',
    birdiePrompt: 'What documents belong in the weekly Director Packet and who receives it?',
    triggers: { days: [4] },
  },
  {
    id: 'thursday-lesson-plans',
    section: 'today',
    category: 'Curriculum',
    urgency: 'high',
    title: '📚 Thursday: lesson plans due',
    body: 'All classroom lesson plans for next week are due today by end of day. Check Tadpoles for submissions — any classroom without a plan needs a direct conversation before they leave.',
    birdiePrompt: 'What are the requirements for a compliant lesson plan at Bright Beginnings, and what should I do when a teacher consistently submits them late?',
    triggers: { days: [4] },
  },
  {
    id: 'thursday-paychecks',
    section: 'today',
    category: 'Payroll',
    urgency: 'medium',
    title: '💵 Thursday: paychecks after 5 PM',
    body: 'Paychecks are distributed on Thursdays after 5 PM — not before. Hold them at the front desk; do not leave in mailboxes or give to other staff. Hand directly to the employee.',
    birdiePrompt: 'What\'s the correct procedure for paycheck distribution, and what do I do if an employee asks for their check early?',
    triggers: { days: [4] },
  },
  {
    id: 'friday-dor-wor',
    section: 'today',
    category: 'Documentation',
    urgency: 'high',
    title: '📋 Friday: DOR/WOR due by 3 PM',
    body: 'The Daily Operations Report and Weekly Operations Report are both due by 3 PM today — not 5 PM. Get them submitted before afternoon pickup rush begins.',
    birdiePrompt: 'What\'s the difference between the DOR and WOR, and what are the key items that must appear in each?',
    triggers: { days: [5] },
  },
  {
    id: 'friday-labor',
    section: 'today',
    category: 'Payroll',
    urgency: 'high',
    title: '💼 Friday: labor report by 5 PM',
    body: 'Submit the weekly labor report by 5 PM. Verify all hours are accurate in ProCare before exporting. Any discrepancies discovered after payroll runs require a correction process.',
    birdiePrompt: 'How do I run the weekly labor report in ProCare and what do I verify before submitting?',
    triggers: { days: [5] },
  },

  // ── THIS MONTH — date-of-month ────────────────────────────────────────
  {
    id: 'date-1-late-fees',
    section: 'thisMonth',
    category: 'Billing',
    urgency: 'high',
    title: '💲 Day 1: late fees & voicemail',
    body: 'First of the month: apply any outstanding late fees in ProCare and update the center voicemail to reflect the new month. Also schedule the monthly fire drill if not yet on the calendar.',
    birdiePrompt: 'How do I apply late fees in ProCare, and what information should be in the monthly center voicemail greeting?',
    triggers: { dates: [1] },
  },
  {
    id: 'date-2-reports',
    section: 'thisMonth',
    category: 'Billing',
    urgency: 'high',
    title: '📊 Day 2: deposit & forecast reports',
    body: 'Run the monthly deposit summary, revenue forecast, and immunization due report in ProCare today. These feed into the ownership packet and license compliance review.',
    birdiePrompt: 'Walk me through the ProCare paths for the monthly deposit, revenue forecast, and immunization due reports.',
    triggers: { dates: [2] },
  },
  {
    id: 'date-3-licensing-binder',
    section: 'thisMonth',
    category: 'Compliance',
    urgency: 'medium',
    title: '📂 Day 3: licensing binder review',
    body: 'On the 3rd, pull out the licensing binder and verify everything is current: staff records, fire drill logs, menu, injury reports, and vehicle inspection records if applicable.',
    birdiePrompt: 'What documents must be in a Virginia childcare licensing binder, and what are the most common deficiencies during inspections?',
    triggers: { dates: [3] },
  },
  {
    id: 'date-5-bad-debt',
    section: 'thisMonth',
    category: 'Billing',
    urgency: 'high',
    title: '🚨 Day 5: bad-debt deadline / deny care',
    body: 'Any account not resolved by Day 5 must be denied care today. This is not optional. ProCare path: Family > Account. Log the denial and send written notice. Warrant in Debt can be filed in Albemarle County General District Court for amounts up to $5,000.',
    birdiePrompt: 'What is the exact process for denying care for non-payment, and how does the Warrant in Debt process work for Albemarle County?',
    triggers: { dates: [5] },
  },
  {
    id: 'date-6-brivo',
    section: 'thisMonth',
    category: 'Facilities',
    urgency: 'medium',
    title: '🔐 Day 6: Brivo access audit',
    body: 'Log in to Brivo and audit door access on the 6th. Verify no former employees still have active credentials and that new staff have been added correctly.',
    birdiePrompt: 'What should I check in Brivo during a monthly access audit, and what do I do when an employee is terminated?',
    triggers: { dates: [6] },
  },
  {
    id: 'date-20-audit-reports',
    section: 'thisMonth',
    category: 'Compliance',
    urgency: 'high',
    title: '🔎 Day 20: run 3 audit reports',
    body: 'On the 20th, run these three ProCare audit reports: (1) Enrollment Audit, (2) Financial Audit, and (3) Attendance Audit. Review for anomalies before month-end billing.',
    birdiePrompt: 'What are the enrollment, financial, and attendance audit reports in ProCare, and what do I look for in each?',
    triggers: { dates: [20] },
  },
  {
    id: 'date-23-tuition-posted',
    section: 'thisMonth',
    category: 'Billing',
    urgency: 'high',
    title: '💳 Day 23: post next month\'s tuition',
    body: 'Post next month\'s tuition charges in ProCare on the 23rd so families can see them before the Day 27 auto-charge. This also allows time to correct any rate discrepancies.',
    birdiePrompt: 'How do I post monthly tuition charges in ProCare, and what do I do if a family\'s rate has changed?',
    triggers: { dates: [23] },
  },
  {
    id: 'date-26-tour-blitz',
    section: 'thisMonth',
    category: 'Enrollment',
    urgency: 'medium',
    title: '📞 Day 26: tour blitz',
    body: 'Three days before billing, call all prospective families who toured this month but haven\'t enrolled. Urgency is natural — "we have a spot available" — and the timing is good before the month turns.',
    birdiePrompt: 'What\'s a compelling phone script for following up with a prospective family who toured but hasn\'t enrolled?',
    triggers: { dates: [26] },
  },
  {
    id: 'date-27-billing-day',
    section: 'thisMonth',
    category: 'Billing',
    urgency: 'high',
    title: '🔴 Day 27: BILLING DAY',
    body: 'Tuition Express auto-charges run today. Monitor for declines throughout the day. Merchant IDs: CR-7657, FL-7660, MC-7673. CCA codes: FL-2935, CR-9252, MC-9304. Enhancement fee: $300 single / $500 family.',
    birdiePrompt: 'A Tuition Express payment declined today. What are the exact steps I should take, and what do I tell the family?',
    triggers: { dates: [27] },
  },
  {
    id: 'date-29-kpi-scorecard',
    section: 'thisMonth',
    category: 'Operations',
    urgency: 'medium',
    title: '📈 Day 29: KPI scorecard to admin assistant',
    body: 'Compile and send the monthly KPI scorecard to your admin assistant by the 29th. Include: enrollment %, attendance rate, Tadpoles engagement, late-fee recovery %, and any licensing events.',
    birdiePrompt: 'What key metrics should be on a monthly director KPI scorecard for a preschool?',
    triggers: { dates: [29] },
  },

  // ── THIS SEASON — month-based ─────────────────────────────────────────
  {
    id: 'month-january',
    section: 'thisSeason',
    category: 'Seasonal',
    urgency: 'medium',
    title: '🎉 January: new year enrollment push',
    body: 'January is prime enrollment season — families are making childcare decisions after the holidays. Run a re-registration campaign for returning families and a new-year tour blitz for waitlisted prospects.',
    birdiePrompt: 'What\'s the most effective enrollment strategy for January, and how do I re-engage families who toured last fall?',
    triggers: { months: [1] },
  },
  {
    id: 'month-february',
    section: 'thisSeason',
    category: 'Seasonal',
    urgency: 'medium',
    title: '💝 February: confirm enrollment & Valentine\'s events',
    body: 'February is the deadline window for re-registration confirmations. Plan Valentine\'s Day classroom events, send save-the-dates, and remind parents of the re-registration fee schedule.',
    birdiePrompt: 'How should I structure February parent communication around re-registration deadlines and Valentine\'s events?',
    triggers: { months: [2] },
  },
  {
    id: 'month-march',
    section: 'thisSeason',
    category: 'Seasonal',
    urgency: 'high',
    title: '🌸 March: re-registration due + spring enrollment',
    body: 'Re-registration is typically due in March for returning families. Lock in fall spots, open new-family enrollment officially, and begin spring classroom planning with teachers.',
    birdiePrompt: 'What does the re-registration process look like at Bright Beginnings, including fees and deadlines?',
    triggers: { months: [3] },
  },
  {
    id: 'month-april',
    section: 'thisSeason',
    category: 'Seasonal',
    urgency: 'medium',
    title: '🌷 April: spring events & Teacher Appreciation prep',
    body: 'April: plan spring family events, confirm field trip logistics, and begin Teacher Appreciation Week planning (typically first full week of May). Confirm t-shirt order: children = light blue, teachers = hot pink.',
    birdiePrompt: 'What planning steps should I take in April to prepare for Teacher Appreciation Week in May?',
    triggers: { months: [4] },
  },
  {
    id: 'month-may',
    section: 'thisSeason',
    category: 'Seasonal',
    urgency: 'high',
    title: '🏆 May: Teacher Appreciation Week',
    body: 'Teacher Appreciation Week is in May — the highest-visibility moment for staff morale. Plan daily themes, parent involvement, treats, and personal recognition for every staff member. End-of-year ceremonies begin now.',
    birdiePrompt: 'What are some creative, budget-friendly ideas for Teacher Appreciation Week at a preschool?',
    triggers: { months: [5] },
  },
  {
    id: 'month-june',
    section: 'thisSeason',
    category: 'Compliance',
    urgency: 'high',
    title: '🚫 June: no new DSS without KP approval',
    body: 'Effective June 2025: no new DSS enrollments without KP approval. Existing DSS families continue normally. Contact KP before initiating any new DSS paperwork or commitments.',
    birdiePrompt: 'What is the current DSS enrollment policy at Bright Beginnings, and how should I handle a DSS family who wants to enroll this summer?',
    triggers: { months: [6] },
  },
  {
    id: 'month-july',
    section: 'thisSeason',
    category: 'Seasonal',
    urgency: 'medium',
    title: '☀️ July: summer operations check',
    body: 'Summer: verify AC is functioning in every classroom. Summer ratio rules apply — check for any schedule adjustments. Water play requires additional parent consent forms on file.',
    birdiePrompt: 'What operational items need extra attention during summer months at a Virginia preschool?',
    triggers: { months: [7] },
  },
  {
    id: 'month-august',
    section: 'thisSeason',
    category: 'Seasonal',
    urgency: 'high',
    title: '🎒 August: back-to-school prep',
    body: 'August is the most operationally intense month. New families start, classroom assignments finalize, teacher schedules publish, and licensing binders must be completely updated before September.',
    birdiePrompt: 'What is the director\'s August back-to-school checklist for a Virginia childcare center?',
    triggers: { months: [8] },
  },
  {
    id: 'month-september',
    section: 'thisSeason',
    category: 'Seasonal',
    urgency: 'medium',
    title: '🍂 September: fall enrollment & field trips',
    body: 'September: confirm fall enrollment is full, lock in field trip destinations for the season (see seasonal destinations table), and begin planning the fall family events calendar.',
    birdiePrompt: 'What field trip planning requirements does Bright Beginnings have, including bus rules, t-shirt colors, and parent driver requirements?',
    triggers: { months: [9] },
  },
  {
    id: 'month-october',
    section: 'thisSeason',
    category: 'Seasonal',
    urgency: 'medium',
    title: '🎃 October: Halloween events & fire safety month',
    body: 'October is Fire Safety Month — verify all fire drills are logged and equipment is inspected. Plan Halloween parade or costume event with parent communication well in advance.',
    birdiePrompt: 'What are the fire drill and safety equipment requirements for Virginia licensed childcare centers?',
    triggers: { months: [10] },
  },
  {
    id: 'month-november',
    section: 'thisSeason',
    category: 'Seasonal',
    urgency: 'medium',
    title: '🦃 November: parent conferences & Thanksgiving',
    body: 'November is conference season. Use the 2-area-max rule: identify no more than 2 areas for growth per child — anything beyond that overwhelms families. Schedule conferences before Thanksgiving break.',
    birdiePrompt: 'What is the 2-area-max rule for parent conferences, and how do I structure a conference that\'s both honest and encouraging?',
    triggers: { months: [11] },
  },
  {
    id: 'month-december',
    section: 'thisSeason',
    category: 'Seasonal',
    urgency: 'medium',
    title: '🎄 December: holiday events & year-end planning',
    body: 'December: run holiday classroom events, distribute end-of-year family letters, and begin the new year enrollment forecast. Confirm all staff schedules over holiday break well in advance.',
    birdiePrompt: 'What should be in a director\'s end-of-year communication to families, and how do I prepare for the enrollment cycle reset in January?',
    triggers: { months: [12] },
  },

  // ── ALWAYS — rotating reminders ───────────────────────────────────────
  {
    id: 'always-parent-visibility',
    section: 'today',
    category: 'Leadership',
    urgency: 'low',
    title: '👁 Director visibility: be seen',
    body: 'The most powerful thing a director can do daily is be present and visible. Walk every classroom before 10 AM. A brief check-in with each lead teacher prevents small problems from becoming big ones.',
    birdiePrompt: 'What should a director look for during classroom walkthrough checks?',
    triggers: { always: true, rotateIndex: 0 },
  },
  {
    id: 'always-tadpoles-check',
    section: 'today',
    category: 'Communications',
    urgency: 'low',
    title: '📸 Tadpoles engagement check',
    body: 'Review this week\'s Tadpoles activity across classrooms. Are all teachers submitting daily notes and 2 staged photos before 3 PM? Low engagement classrooms need coaching, not just reminders.',
    birdiePrompt: 'How should I coach a teacher who is consistently inconsistent with Tadpoles documentation?',
    triggers: { always: true, rotateIndex: 1 },
  },
  {
    id: 'always-cstaff-check',
    section: 'today',
    category: 'HR',
    urgency: 'low',
    title: '📝 C-staff improvement plan check',
    body: 'If you have any C-staff on corrective plans, review their progress today. Are follow-up dates on your calendar? Is documentation current? Gaps in documentation create liability.',
    birdiePrompt: 'What documentation is required when managing a C-staff member on a corrective improvement plan?',
    triggers: { always: true, rotateIndex: 2 },
  },
  {
    id: 'always-enrollment-check',
    section: 'today',
    category: 'Enrollment',
    urgency: 'low',
    title: '📊 Enrollment health check',
    body: 'Pull up your enrollment numbers today. What\'s your capacity utilization? Any classrooms with open spots? The phone script 10-step process has a $25,800 lifetime value per child — every open spot is real revenue.',
    birdiePrompt: 'What\'s the best approach for filling an open enrollment spot quickly, and what does the BB phone script look like?',
    triggers: { always: true, rotateIndex: 3 },
  },
]

/**
 * Returns all tips that apply right now, sorted by urgency (high → medium → low).
 * @param {Date} [now] — inject a date for testing; defaults to current time
 */
export function getTipsForNow(now = new Date()) {
  const hour      = now.getHours() + now.getMinutes() / 60   // decimal hours
  const dayOfWeek = now.getDay()                             // 0=Sun
  const date      = now.getDate()                            // 1–31
  const month     = now.getMonth() + 1                       // 1–12
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)

  const URGENCY_ORDER = { high: 0, medium: 1, low: 2 }

  const matched = TIPS.filter(tip => {
    const t = tip.triggers
    if (t.timeStart !== undefined) return hour >= t.timeStart && hour < t.timeEnd
    if (t.days)                    return t.days.includes(dayOfWeek)
    if (t.dates)                   return t.dates.includes(date)
    if (t.months)                  return t.months.includes(month)
    if (t.always)                  return (dayOfYear % 4) === t.rotateIndex
    return false
  })

  return matched.sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency])
}

/**
 * Returns tips grouped by section.
 */
export function getTipsGrouped(now = new Date()) {
  const tips = getTipsForNow(now)
  return {
    rightNow:   tips.filter(t => t.section === 'rightNow'),
    today:      tips.filter(t => t.section === 'today'),
    thisMonth:  tips.filter(t => t.section === 'thisMonth'),
    thisSeason: tips.filter(t => t.section === 'thisSeason'),
  }
}
