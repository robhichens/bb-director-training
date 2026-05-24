/**
 * patch-quizzes.mjs
 * Adds new questions to every quiz to bring each to 10 questions.
 * Run: node scripts/patch-quizzes.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../src/modules')

// ── New questions keyed by quizId ─────────────────────────────────────────
const NEW_QUESTIONS = {

  // ── MODULE 1 ────────────────────────────────────────────────────────────

  '1.1-quiz': [
    {
      id: 'q5',
      question: 'True or False: A Bright Beginnings director may approve a C-rated staff member for a merit raise.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'C-rated staff are not eligible for merit raises. They must first reach and sustain a B rating through the improvement process.'
    },
    {
      id: 'q6',
      question: 'When should a director conduct classroom walkthroughs?',
      type: 'multiple-choice',
      options: ['Once per week on Monday mornings', 'Only when a licensing inspection is scheduled', 'Daily — at least one visit to every classroom', 'Whenever a staff member requests it'],
      correctAnswer: 'Daily — at least one visit to every classroom',
      explanation: 'Daily walkthroughs are non-negotiable. They catch compliance gaps early, support teachers, and reinforce standards before they slip.'
    },
    {
      id: 'q7',
      question: 'What is the correct first step when you observe a staff member using their cell phone around children?',
      type: 'multiple-choice',
      options: ['Send them home for the rest of the day', 'Walk over and verbally redirect immediately, then document in ProCare', 'Note it and address it at the next monthly evaluation', 'Call the parent and let them know'],
      correctAnswer: 'Walk over and verbally redirect immediately, then document in ProCare',
      explanation: 'Cell phone violations require immediate correction — not waiting. Delayed responses signal tolerance. Always document in ProCare the same day.'
    },
    {
      id: 'q8',
      question: 'What information must appear on the back of every piece of artwork sent home?',
      type: 'multiple-choice',
      options: ['Child\'s first name only', 'First and last name only', 'First name, last name, age, and art media used', 'Child\'s full name and classroom'],
      correctAnswer: 'First name, last name, age, and art media used',
      explanation: 'All four elements are required: First Name, Last Name, Age, and Art Media Used. This is a non-negotiable standard and a parent communication touchpoint.'
    },
    {
      id: 'q9',
      question: 'How many staged Tadpoles photos plus accompanying sentences are required per child, per day?',
      type: 'multiple-choice',
      options: ['1 photo, 1 sentence', '2 photos, 2 sentences', '3 photos, 1 sentence', '1 photo, 2 sentences'],
      correctAnswer: '2 photos, 2 sentences',
      explanation: 'The standard is 2 staged photos and 2 sentences describing the child\'s activities, submitted by 3:00 PM daily.'
    },
    {
      id: 'q10',
      question: 'True or False: A director\'s primary job function is completing administrative paperwork in the office.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'A director\'s primary job is being present on the floor — greeting families, supporting staff, and observing classrooms. Paperwork is secondary and should be done before or after operational hours.'
    },
  ],

  '1.3-quiz': [
    {
      id: 'q5',
      question: 'What is the enrollment target for the Crozet location?',
      type: 'multiple-choice',
      options: ['52', '68', '72', '102'],
      correctAnswer: '72',
      explanation: 'Crozet\'s enrollment target is 72 children. Each location has its own target based on licensed capacity and operational goals.'
    },
    {
      id: 'q6',
      question: 'What is the enrollment target for Forest Lakes?',
      type: 'multiple-choice',
      options: ['88', '96', '102', '117'],
      correctAnswer: '102',
      explanation: 'Forest Lakes has an enrollment target of 102 children. Mill Creek is 117, and Crozet is 72.'
    },
    {
      id: 'q7',
      question: 'True or False: The Weekly Operations Report (WOR) is due by 5:00 PM on Fridays.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'The WOR is due by 3:00 PM on Fridays — not 5:00 PM. Getting it done before afternoon pickup prevents last-minute rushes.'
    },
    {
      id: 'q8',
      question: 'The "Magic Number" refers to which operational metric?',
      type: 'multiple-choice',
      options: ['The tour conversion rate target', 'Running 10% under approved labor hours', 'The 85% minimum enrollment threshold', 'The 1-hour parent response requirement'],
      correctAnswer: 'Running 10% under approved labor hours',
      explanation: 'The Magic Number is the labor efficiency target: running 10% under approved labor hours. It directly impacts profitability.'
    },
    {
      id: 'q9',
      question: 'A center is at 82% enrollment capacity on the first of the month. What should happen?',
      type: 'multiple-choice',
      options: ['Nothing — 82% is within acceptable range', 'Escalate to ownership and launch an aggressive enrollment push immediately', 'Wait until the 15th to reassess', 'Reduce staff hours to compensate for the lower revenue'],
      correctAnswer: 'Escalate to ownership and launch an aggressive enrollment push immediately',
      explanation: '85% is the minimum threshold. Falling below it requires an immediate response — ownership notification and a focused enrollment action plan.'
    },
    {
      id: 'q10',
      question: 'What is the primary purpose of the Director Operations Report (DOR)?',
      type: 'multiple-choice',
      options: ['To track staff hours for payroll', 'To document the day\'s operational events, incidents, and key decisions for accountability', 'To communicate with parents about their child\'s day', 'To report enrollment numbers to ownership weekly'],
      correctAnswer: 'To document the day\'s operational events, incidents, and key decisions for accountability',
      explanation: 'The DOR is the director\'s primary accountability document. It creates a paper trail of the day\'s events, decisions, and any incidents — critical for licensing, HR, and ownership review.'
    },
  ],

  '1.4-quiz': [
    {
      id: 'q5',
      question: 'What year was Bright Beginnings founded?',
      type: 'multiple-choice',
      options: ['1978', '1984', '1991', '2002'],
      correctAnswer: '1984',
      explanation: 'Bright Beginnings was founded in 1984 and has been serving Charlottesville-area families for over 40 years — the longest-running family-owned preschool in the area.'
    },
    {
      id: 'q6',
      question: 'How many Bright Beginnings locations are currently operating?',
      type: 'multiple-choice',
      options: ['Two', 'Three', 'Four', 'Five'],
      correctAnswer: 'Three',
      explanation: 'Bright Beginnings operates three locations: Forest Lakes, Mill Creek, and Crozet.'
    },
    {
      id: 'q7',
      question: 'What is the referral bonus for a current STAFF member who refers a new staff hire who completes 90 days?',
      type: 'multiple-choice',
      options: ['$25', '$50', '$100', '$150'],
      correctAnswer: '$50',
      explanation: 'Staff receive a $50 referral bonus when a person they referred is hired and completes 90 days of employment. The bonus is paid at the 90-day mark.'
    },
    {
      id: 'q8',
      question: 'True or False: Bright Beginnings\' core values include a commitment to never turning away a family for inability to pay.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'While BB values serving the community, an open-ended commitment to never turn away families for financial reasons is not one of the stated core values. Financial sustainability is essential to serving families well.'
    },
    {
      id: 'q9',
      question: 'Which of the following best describes the Bright Beginnings Career Ladder?',
      type: 'multiple-choice',
      options: ['A pay scale based solely on years of service', 'A structured progression from Substitute to Lead Teacher based on credentials, performance, and tenure', 'A management track for directors only', 'An annual merit review with no defined steps'],
      correctAnswer: 'A structured progression from Substitute to Lead Teacher based on credentials, performance, and tenure',
      explanation: 'The Career Ladder defines a clear path from Substitute → Teacher\'s Aide → Teacher → Lead Teacher, based on a combination of credentials, performance ratings, and time in role.'
    },
    {
      id: 'q10',
      question: 'The Bright Beginnings philosophy centers on which core belief about early childhood?',
      type: 'multiple-choice',
      options: ['Academic readiness is the primary goal for all children under 5', 'Children learn best through structured, teacher-led instruction', 'Play is children\'s work — learning happens through doing, exploring, and relationships', 'Social-emotional learning is less important than pre-reading skills'],
      correctAnswer: 'Play is children\'s work — learning happens through doing, exploring, and relationships',
      explanation: 'BB\'s core educational philosophy is play-based learning. Children at this age learn most effectively through hands-on exploration, social interaction, and guided play — not seat work or direct instruction.'
    },
  ],

  '1.5-quiz': [
    {
      id: 'q5',
      question: 'By what day and time are staff lesson plans due each week?',
      type: 'multiple-choice',
      options: ['Monday at 8:00 AM', 'Wednesday at 5:00 PM', 'Thursday by end of day', 'Friday at 3:00 PM'],
      correctAnswer: 'Thursday by end of day',
      explanation: 'Lesson plans are due every Thursday for the following week — one full week in advance. A plan handed in Monday morning for the current week is late.'
    },
    {
      id: 'q6',
      question: 'True or False: Staff may keep personal food and drinks in the classroom refrigerator without labeling them.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'All personal food items must be clearly labeled with the staff member\'s name. Unlabeled items in shared refrigerators create sanitation and allergen risks.'
    },
    {
      id: 'q7',
      question: 'What is the correct procedure when a non-employee walks in without an appointment?',
      type: 'multiple-choice',
      options: ['Ask them to wait in the lobby and let the teacher know', 'Require photo ID, photograph it, and have them sign the visitor log before proceeding', 'Call the parent to verify and then allow entry', 'Offer them a tour if they seem interested in enrolling'],
      correctAnswer: 'Require photo ID, photograph it, and have them sign the visitor log before proceeding',
      explanation: 'All non-employees must show photo ID, have it photographed, and sign the visitor log before entering the center. No exceptions — even for delivery drivers.'
    },
    {
      id: 'q8',
      question: 'Nothing may be posted on walls or doors without whose approval?',
      type: 'multiple-choice',
      options: ['The lead teacher\'s approval', 'Parent committee approval', 'The director\'s approval', 'Ownership\'s approval'],
      correctAnswer: 'The director\'s approval',
      explanation: 'All postings — in classrooms, hallways, and on doors — require director approval before going up. This maintains the professional environment and brand standards.'
    },
    {
      id: 'q9',
      question: 'Where must staff cell phones be kept during their work shift?',
      type: 'multiple-choice',
      options: ['In the classroom on silent', 'In their back pocket on vibrate only', 'Locked away — not on their person during childcare hours', 'In the break room during their classroom time'],
      correctAnswer: 'Locked away — not on their person during childcare hours',
      explanation: 'Cell phones must be locked away — not in a pocket, apron, or bag accessible to staff during classroom hours. Presence of the phone itself creates distraction risk.'
    },
    {
      id: 'q10',
      question: 'True or False: A director may skip completing the DOR on a day when nothing significant happened.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'The DOR is completed every single operating day — there are no exceptions. Even uneventful days must be documented. "Nothing to report" is not a DOR.'
    },
  ],

  '1.7-quiz': [
    {
      id: 'q6',
      question: 'A staff member hasn\'t submitted a Tadpoles note for three days. What is the correct sequence of actions?',
      type: 'multiple-choice',
      options: ['Wait until the monthly review to address it', 'Send a group reminder to all staff via GroupMe', 'Have a direct private conversation immediately, document it, and set a clear expectation with a follow-up date', 'Write a formal warning letter without first having a conversation'],
      correctAnswer: 'Have a direct private conversation immediately, document it, and set a clear expectation with a follow-up date',
      explanation: 'Persistent missed Tadpoles notes are addressed directly and privately. Group messages dilute accountability. The conversation must be documented in ProCare.'
    },
    {
      id: 'q7',
      question: 'True or False: A director should complete a task a staff member repeatedly fails to do, in order to maintain center standards.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Directors doing staff work removes accountability and creates dependency. The correct response is to address the performance issue directly through coaching and documentation — not to absorb the task.'
    },
    {
      id: 'q8',
      question: 'A classroom has no current lesson plan posted as of Friday morning. What should you do?',
      type: 'multiple-choice',
      options: ['Post a generic template yourself so the room is covered', 'Find the lead teacher before they leave and require the plan be submitted today', 'Contact the parent committee for guidance', 'Note it in the DOR and address it next week'],
      correctAnswer: 'Find the lead teacher before they leave and require the plan be submitted today',
      explanation: 'Lesson plans are due Thursday. By Friday morning you should be having a direct conversation and getting the plan submitted before end of day — not absorbing the work or waiting another week.'
    },
    {
      id: 'q9',
      question: 'What is the "Dream Team" event and how often does it occur?',
      type: 'multiple-choice',
      options: ['A monthly staff performance review meeting', 'A quarterly all-hands cleaning and reorganizing event', 'A bi-weekly team-building activity for lead teachers', 'An annual award ceremony for top-rated staff'],
      correctAnswer: 'A quarterly all-hands cleaning and reorganizing event',
      explanation: 'Dream Team events happen quarterly and involve all staff in deep cleaning and reorganizing the center. They build team cohesion while maintaining facility standards.'
    },
    {
      id: 'q10',
      question: 'True or False: The director\'s personal behavior in managing their own time and presence directly affects staff culture.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'Directors model the culture. A director who is consistently present, organized, and accountable creates those same expectations on the floor. A director who is late, scattered, or disengaged signals those behaviors are acceptable.'
    },
  ],

  // ── MODULE 2 ────────────────────────────────────────────────────────────

  '2.1-quiz': [
    {
      id: 'q5',
      question: 'At what time should the center voicemail be updated each month?',
      type: 'multiple-choice',
      options: ['Every Monday morning', 'The first of each month', 'Whenever a major policy changes', 'At the start of each new enrollment season'],
      correctAnswer: 'The first of each month',
      explanation: 'The voicemail is updated on Day 1 of each month to reflect current hours, upcoming events, and any relevant announcements.'
    },
    {
      id: 'q6',
      question: 'True or False: A director must be present to open the center every day it operates.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'A qualified lead teacher or designated opener may open the center. However, the director must be reachable and must have systems in place to ensure the opening checklist is followed correctly.'
    },
    {
      id: 'q7',
      question: 'What time does the core director workday typically begin?',
      type: 'multiple-choice',
      options: ['6:30 AM', '7:30 AM', '8:00 AM', '8:30 AM'],
      correctAnswer: '7:30 AM',
      explanation: 'Directors are expected on-site by 7:30 AM to oversee morning drop-off. The first 90 minutes of the day set the tone for everything that follows.'
    },
    {
      id: 'q8',
      question: 'When should a director personally call a new family for a first-day check-in call?',
      type: 'multiple-choice',
      options: ['Day 1, within 30 minutes of drop-off', 'End of Day 1 after the child leaves', 'Day 2 of attendance', 'At the end of the first full week'],
      correctAnswer: 'Day 2 of attendance',
      explanation: 'The director personally calls the new family on Day 2 to check in on the transition. Day 1 gets a 30-minute staff text; Day 2 is the director\'s personal outreach call.'
    },
    {
      id: 'q9',
      question: 'What is the required frequency for fire drills at a Virginia childcare center?',
      type: 'multiple-choice',
      options: ['Annually', 'Semi-annually', 'Monthly', 'Quarterly'],
      correctAnswer: 'Monthly',
      explanation: 'Virginia licensing requires fire drills to be conducted monthly. Each drill must be logged with the date, time, evacuation time, and number of children present.'
    },
    {
      id: 'q10',
      question: 'True or False: The afternoon closing checklist is the lead teacher\'s responsibility — directors do not need to verify it.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Directors own the daily checklists. While lead teachers execute many closing duties, the director is responsible for verifying that all items are completed before locking up.'
    },
  ],

  '2.3-quiz': [
    {
      id: 'q5',
      question: 'By what time must the Wednesday maintenance list be emailed each week?',
      type: 'multiple-choice',
      options: ['9:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'],
      correctAnswer: '12:00 PM',
      explanation: 'The weekly maintenance list must be sent to robhichens84@gmail.com by 12:00 PM every Wednesday — not end of day.'
    },
    {
      id: 'q6',
      question: 'What happens to paychecks on Thursday and when are they distributed?',
      type: 'multiple-choice',
      options: ['Paychecks are left in staff mailboxes before 3 PM', 'Paychecks are held at the front desk and distributed to each employee directly after 5 PM', 'Paychecks are mailed directly to staff home addresses', 'Staff pick up checks from the admin office anytime Thursday'],
      correctAnswer: 'Paychecks are held at the front desk and distributed to each employee directly after 5 PM',
      explanation: 'Paychecks are held at the front desk on Thursdays and distributed directly to each employee — after 5 PM. They are never left in mailboxes or given to another staff member.'
    },
    {
      id: 'q7',
      question: 'True or False: The Friday "wins email" is optional and only sent during strong performance weeks.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'The Friday wins email is sent every week without exception. Consistent positive recognition is a culture-building tool — it shouldn\'t only appear when things go well.'
    },
    {
      id: 'q8',
      question: 'What is the purpose of the mid-week overtime check on Wednesdays?',
      type: 'multiple-choice',
      options: ['To approve overtime for that week in advance', 'To identify staff approaching 40 hours so schedules can be adjusted before Friday', 'To calculate the weekly labor percentage for the Director Packet', 'To confirm all staff have taken their required meal breaks'],
      correctAnswer: 'To identify staff approaching 40 hours so schedules can be adjusted before Friday',
      explanation: 'Wednesday is the right moment to catch overtime risk. A staff member at 32+ hours by Wednesday is likely to hit 40 before Friday. Catching it Wednesday means you can adjust — catching it Friday means the overtime already happened.'
    },
    {
      id: 'q9',
      question: 'The Thursday leadership meeting is described as which of the following?',
      type: 'multiple-choice',
      options: ['Optional unless there are performance issues to discuss', 'Mandatory — no exceptions without prior ownership approval', 'Required only for lead teachers and above', 'A bi-weekly meeting held on alternating Thursdays'],
      correctAnswer: 'Mandatory — no exceptions without prior ownership approval',
      explanation: 'The Thursday leadership meeting is mandatory. Missing it without prior ownership approval is a performance issue. It\'s the primary alignment touchpoint between the director and the leadership team.'
    },
    {
      id: 'q10',
      question: 'True or False: The DSS portal should be checked on the first business day of each week.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'The DSS portal is checked every Monday (first business day of the week) to review authorizations, updates, and any pending actions. Regular monitoring prevents billing errors and compliance gaps.'
    },
  ],

  '2.5-quiz': [
    {
      id: 'q5',
      question: 'What is the estimated lifetime enrollment value of a single child at Bright Beginnings?',
      type: 'multiple-choice',
      options: ['$8,600', '$12,900', '$25,800', '$51,600'],
      correctAnswer: '$25,800',
      explanation: 'At an average of 3 years enrollment × $8,600/year, one child represents approximately $25,800 in lifetime value. A two-child family is approximately $51,600.'
    },
    {
      id: 'q6',
      question: 'True or False: The tour follow-up call should be made within 24 hours if the family didn\'t enroll that day.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'The follow-up system calls for same-day contact (within 2 hours), then Day 3, then Day 7. A 24-hour-only follow-up doesn\'t capture the structured cadence that maximizes conversion.'
    },
    {
      id: 'q7',
      question: 'During the in-person tour, when should you show the prospective family the target classroom?',
      type: 'multiple-choice',
      options: ['At the end of the tour as a grand finale', 'In the middle after building rapport', 'First — it\'s what they came to see', 'Only if the classroom looks particularly good that day'],
      correctAnswer: 'First — it\'s what they came to see',
      explanation: 'The child\'s target classroom should be shown first. Families came specifically to see where their child would be. Starting there keeps them engaged and anchors everything else to what matters most to them.'
    },
    {
      id: 'q8',
      question: 'The 10-step phone script is designed primarily to accomplish which goal?',
      type: 'multiple-choice',
      options: ['Qualify whether a family can afford the center\'s tuition', 'Convert a phone inquiry into a scheduled in-person tour', 'Gather child health information before enrollment', 'Explain all center policies before the family visits'],
      correctAnswer: 'Convert a phone inquiry into a scheduled in-person tour',
      explanation: 'The phone script\'s sole objective is to schedule the tour. Everything else — pricing, policies, availability — is handled in person. A tour booked is a potential enrollment. A tour not booked is a lost opportunity.'
    },
    {
      id: 'q9',
      question: 'True or False: You should tell a prospective family the exact price over the phone if they ask directly.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Price conversations happen in person, after the family has seen the center and connected emotionally. Giving price over the phone without value context almost always ends the conversation. Redirect: "I\'d love to go over everything with you in person so you can see what\'s included."'
    },
    {
      id: 'q10',
      question: 'After an in-person tour, what is the ideal next action to take before the family leaves?',
      type: 'multiple-choice',
      options: ['Give them a brochure and follow up in a week', 'Ask for a deposit to hold the spot, or confirm a specific follow-up date and time', 'Email them the enrollment paperwork that evening', 'Let them know you\'ll call if a spot opens up'],
      correctAnswer: 'Ask for a deposit to hold the spot, or confirm a specific follow-up date and time',
      explanation: 'Letting a family leave without either a deposit or a confirmed follow-up date is the most common enrollment miss. Ask directly — a family who loved the tour is ready to be asked.'
    },
  ],

  // ── MODULE 3 ────────────────────────────────────────────────────────────

  '3.1-quiz': [
    {
      id: 'q5',
      question: 'True or False: A director can allow a new hire to begin work before their background check is cleared if the hire has strong references.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'This is absolute: no new hire enters the building in any capacity until their fingerprint background check is cleared. References and qualifications are irrelevant to this rule.'
    },
    {
      id: 'q6',
      question: 'What is the Day 1 orientation priority for every new hire?',
      type: 'multiple-choice',
      options: ['Reviewing the employee handbook cover to cover', 'Observing in the classroom they\'ll be assigned to', 'Completing all required state orientation hours and paperwork', 'Shadowing the director for a full day'],
      correctAnswer: 'Completing all required state orientation hours and paperwork',
      explanation: 'Day 1 is focused on the required state orientation hours and completing the full new hire document checklist. Every document has a compliance purpose — none can wait.'
    },
    {
      id: 'q7',
      question: 'Which of the following documents must be uploaded to the new hire\'s licensing file — not just kept in the BB staff file?',
      type: 'multiple-choice',
      options: ['W-4 tax form', 'Background check clearance', 'Direct deposit form', 'Emergency contact card'],
      correctAnswer: 'Background check clearance',
      explanation: 'The background check clearance, TB test, CPR certification, and orientation completion all go into the licensing file. The licensing file is what inspectors review — it must be airtight.'
    },
    {
      id: 'q8',
      question: 'What is the structured check-in timeline for a new hire\'s first 90 days?',
      type: 'multiple-choice',
      options: ['Check-ins at 30 and 90 days only', 'Check-ins at Day 1, 7, 20, 30, 60, and 90', 'Monthly check-ins for the first quarter', 'A single formal review at the 90-day mark'],
      correctAnswer: 'Check-ins at Day 1, 7, 20, 30, 60, and 90',
      explanation: 'The onboarding timeline includes check-ins at Day 1, 7, 20, 30, 60, and 90. Each serves a specific purpose — early check-ins address confusion, later ones assess fit and performance.'
    },
    {
      id: 'q9',
      question: 'During a hiring interview, a candidate says she\'s "flexible with hours" but her childcare availability is only 8 AM–3 PM. What should you do?',
      type: 'multiple-choice',
      options: ['Hire her and adjust the schedule around her availability', 'Note the discrepancy and ask specifically about afternoon and closing shift availability before proceeding', 'Decline immediately — closing availability is required for all positions', 'Accept her answer at face value and move forward'],
      correctAnswer: 'Note the discrepancy and ask specifically about afternoon and closing shift availability before proceeding',
      explanation: 'Availability mismatches are one of the most common early-exit reasons. Clarify specifically before extending an offer — "flexible" and "8–3 only" are not compatible at most centers.'
    },
    {
      id: 'q10',
      question: 'True or False: A $50 staff referral bonus is paid as soon as the referred person is hired.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'The $50 referral bonus is paid after the referred hire completes 90 days of employment. This ensures the referral was a quality recommendation, not just a name.'
    },
  ],

  '3.2-quiz': [
    {
      id: 'q5',
      question: 'What is the Virginia-required staff-to-child ratio for an infant classroom (under 16 months)?',
      type: 'multiple-choice',
      options: ['1:3', '1:4', '1:5', '1:6'],
      correctAnswer: '1:4',
      explanation: 'Virginia licensing requires a 1:4 ratio in infant classrooms (children under 16 months). This is the most restrictive ratio across all age groups.'
    },
    {
      id: 'q6',
      question: 'True or False: A director may combine two classrooms temporarily if one teacher calls out, as long as the total child count stays under 20.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Classroom combination is only legal if ratio requirements are met for both age groups represented AND the combined group doesn\'t exceed the classroom\'s licensed square footage. Total count alone is not the standard.'
    },
    {
      id: 'q7',
      question: 'What is the Virginia staff-to-child ratio for preschool (3–4 year olds)?',
      type: 'multiple-choice',
      options: ['1:8', '1:10', '1:12', '1:15'],
      correctAnswer: '1:10',
      explanation: 'Virginia requires a 1:10 ratio for preschool-age children (3–4 year olds). Exceeding this ratio at any point is a licensing violation.'
    },
    {
      id: 'q8',
      question: 'Why is cross-training staff across multiple age groups a scheduling priority?',
      type: 'multiple-choice',
      options: ['It allows staff to earn higher pay rates', 'It satisfies a Virginia licensing requirement for versatile staff', 'It gives the director flexibility to cover call-outs without breaking ratio', 'It reduces the number of lead teachers needed in the building'],
      correctAnswer: 'It gives the director flexibility to cover call-outs without breaking ratio',
      explanation: 'A staff member who can legally work in both the toddler and preschool rooms is twice as useful in a coverage crisis. Cross-training is a direct investment in operational resilience.'
    },
    {
      id: 'q9',
      question: 'When does overtime require notification to admin (ownership)?',
      type: 'multiple-choice',
      options: ['Only when a staff member requests it in advance', 'Any time a staff member is projected to exceed 40 hours in a week', 'Only when it happens — after the fact is fine', 'Overtime never requires admin notification at BB'],
      correctAnswer: 'Any time a staff member is projected to exceed 40 hours in a week',
      explanation: 'Overtime is not a director\'s unilateral decision. Any time a staff member is projected to hit 40+ hours, admin must be notified. Unauthorized overtime is a performance issue for the director.'
    },
    {
      id: 'q10',
      question: 'True or False: Scheduling staff at exactly 40 hours per week is the target for the "Magic Number" efficiency goal.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'The Magic Number target is to run 10% UNDER approved labor hours — not at 40 hours. Running right at 40 leaves no buffer for callouts, overtime risk, and provides no efficiency benefit.'
    },
  ],

  '3.4-quiz': [
    {
      id: 'q5',
      question: 'After a staff termination, what should you tell the remaining team?',
      type: 'multiple-choice',
      options: ['A full explanation so the team understands what happened', '"[Name] is no longer with us. We\'re handling coverage and I\'ll keep you updated." Nothing more.', 'Ask them to keep it quiet until a replacement is hired', 'Share that the separation was mutual to avoid morale issues'],
      correctAnswer: '"[Name] is no longer with us. We\'re handling coverage and I\'ll keep you updated." Nothing more.',
      explanation: 'Termination details are private. The team gets a brief, professional statement — nothing more. Sharing reasons opens legal exposure and creates team gossip. Protecting confidentiality is policy, not preference.'
    },
    {
      id: 'q6',
      question: 'True or False: A 30-day improvement plan can be extended to 60 days if the staff member shows partial improvement.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'The 30-day plan has a hard deadline. If the staff member hasn\'t met the stated goals by Day 30, the conversation moves to the next step — not an extension. Extensions erode accountability and signal that deadlines aren\'t real.'
    },
    {
      id: 'q7',
      question: 'A C-rated staff member leaves the building without notifying anyone during their shift. What rating issue does this represent and what is the first action?',
      type: 'multiple-choice',
      options: ['D-level behavior — begin immediate separation process', 'C-level — update their improvement plan goal to include attendance', 'B-level — a first verbal warning is sufficient', 'Not ratable — it could be an emergency'],
      correctAnswer: 'D-level behavior — begin immediate separation process',
      explanation: 'Abandoning a shift is D-level behavior. Leaving children without adequate supervision creates immediate licensing and safety risk. This is a separation-level event — not a coaching moment.'
    },
    {
      id: 'q8',
      question: 'What is the minimum wage obligation for a staff member who resigns with less than two weeks\' notice?',
      type: 'multiple-choice',
      options: ['Standard rate through their last day', 'Minimum wage ($12.71/hr) from the moment they give notice', 'No pay obligation after notice is given without two weeks', 'Time-and-a-half for any shifts after notice'],
      correctAnswer: 'Minimum wage ($12.71/hr) from the moment they give notice',
      explanation: 'If a staff member resigns with less than two weeks\' notice, their rate drops to minimum wage ($12.71/hr) from the moment of notice. This is policy — not optional — and must be applied consistently.'
    },
    {
      id: 'q9',
      question: 'Which of the following deductions can legally be made from a final paycheck at Bright Beginnings?',
      type: 'multiple-choice',
      options: ['None — all deductions are illegal at separation', 'CPR certification ($75), AMAT/MAT ($150), CDA ($200) if the staff member leaves before completing required tenure', 'Only the cost of uniforms and badges', 'Any equipment not returned, at replacement value'],
      correctAnswer: 'CPR certification ($75), AMAT/MAT ($150), CDA ($200) if the staff member leaves before completing required tenure',
      explanation: 'BB may deduct training investment costs — CPR ($75), AMAT/MAT ($150), CDA ($200) — from a final paycheck if the staff member leaves before the agreed tenure period. These amounts and terms are disclosed at hiring.'
    },
    {
      id: 'q10',
      question: 'True or False: When a director or admin staff member is terminated, the process includes changing Gmail/Google Drive passwords and Instagram/TikTok/Facebook credentials.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'Director and admin terminations require an expanded access revocation checklist that includes digital accounts: camera access, Gmail/Drive passwords, social media credentials (Instagram, TikTok, Facebook), Bluehost, LineLeader, ITK, and org chart removal.'
    },
  ],

  // ── MODULE 4 ────────────────────────────────────────────────────────────

  '4.1-quiz': [
    {
      id: 'q5',
      question: 'What is the enrollment target for Mill Creek?',
      type: 'multiple-choice',
      options: ['96', '102', '117', '130'],
      correctAnswer: '117',
      explanation: 'Mill Creek has the highest enrollment target: 117 children. Forest Lakes targets 102 and Crozet targets 72.'
    },
    {
      id: 'q6',
      question: 'True or False: A verbal payment arrangement with a parent satisfies the Day 5 bad debt deadline.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Verbal arrangements do not satisfy the Day 5 deadline. The account must be current or on a formally documented and approved payment plan. Verbal commitments are not enforceable and do not protect the center.'
    },
    {
      id: 'q7',
      question: 'What action must be taken on Day 5 for accounts that remain unresolved?',
      type: 'multiple-choice',
      options: ['Send a final reminder email', 'Place the account in collections', 'Deny care — the child is not admitted until the account is resolved', 'Reduce the family\'s schedule to part-time until caught up'],
      correctAnswer: 'Deny care — the child is not admitted until the account is resolved',
      explanation: 'Day 5 is the denial-of-care deadline. This is non-negotiable. Admitting a child past Day 5 on an unresolved account undercuts the entire billing policy.'
    },
    {
      id: 'q8',
      question: 'When should tuition charges for next month be posted in ProCare?',
      type: 'multiple-choice',
      options: ['Day 1 of the following month', 'Day 15 of the current month', 'Day 23 of the current month', 'Day 27 (billing day)'],
      correctAnswer: 'Day 23 of the current month',
      explanation: 'Next month\'s tuition is posted on Day 23 so families can see charges before the Day 27 auto-charge runs. This allows time to catch and correct any rate discrepancies.'
    },
    {
      id: 'q9',
      question: 'The KPI scorecard is sent to the admin assistant on which day of the month?',
      type: 'multiple-choice',
      options: ['Day 1', 'Day 15', 'Day 27', 'Day 29'],
      correctAnswer: 'Day 29',
      explanation: 'The monthly KPI scorecard is compiled and sent to the admin assistant by Day 29. It includes enrollment %, attendance rate, Tadpoles engagement, late-fee recovery %, and any licensing events.'
    },
    {
      id: 'q10',
      question: 'True or False: The monthly fire drill can be completed any time during the month as long as it happens at least once.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'While the drill can happen any day, it must be scheduled and tracked. Virginia licensing requires one drill per month, and the Day 1 calendar task includes scheduling the monthly drill to ensure it doesn\'t get missed.'
    },
  ],

  '4.3-quiz': [
    {
      id: 'q5',
      question: 'What three ProCare audit reports are run on Day 20 of each month?',
      type: 'multiple-choice',
      options: ['Enrollment Audit, Financial Audit, and Attendance Audit', 'AR Aging Report, Payroll Summary, and Immunization Due report', 'Daily Attendance, Revenue Forecast, and Bad Debt Report', 'Labor Report, Tuition Posted report, and Child Count'],
      correctAnswer: 'Enrollment Audit, Financial Audit, and Attendance Audit',
      explanation: 'Day 20 requires three specific audits: Enrollment Audit, Financial Audit, and Attendance Audit. These are reviewed for anomalies before month-end billing runs on Day 27.'
    },
    {
      id: 'q6',
      question: 'True or False: A director may manually adjust a staff member\'s ProCare time entry without a written explanation.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Any time entry adjustment in ProCare requires written documentation of the reason. Unexplained time adjustments create payroll compliance risk and audit problems.'
    },
    {
      id: 'q7',
      question: 'The Day 2 report bundle includes which three reports?',
      type: 'multiple-choice',
      options: ['AR Aging, Payroll Summary, Staff Schedule', 'Monthly Deposit, Revenue Forecast, and Immunization Due', 'Enrollment Count, Tuition Posted, Labor Report', 'Child Census, Fire Drill Log, and First Aid Inventory'],
      correctAnswer: 'Monthly Deposit, Revenue Forecast, and Immunization Due',
      explanation: 'Day 2 reports: Monthly Deposit summary, Revenue Forecast, and Immunization Due report. These feed the ownership packet and licensing compliance review.'
    },
    {
      id: 'q8',
      question: 'What is the purpose of running the Brivo access audit on Day 6?',
      type: 'multiple-choice',
      options: ['To verify the alarm system is functioning', 'To check that no former employees still have active door access credentials', 'To generate a visitor log for the licensing binder', 'To update parent pickup authorization codes'],
      correctAnswer: 'To check that no former employees still have active door access credentials',
      explanation: 'Day 6 Brivo audit verifies that terminated employees have been removed and new staff have been properly added. Former employee access is a security and liability issue.'
    },
    {
      id: 'q9',
      question: 'When must the daily labor entry in ProCare be finalized each week?',
      type: 'multiple-choice',
      options: ['Thursday at 5:00 PM', 'Friday at 3:00 PM', 'Friday at 5:00 PM', 'Monday of the following week'],
      correctAnswer: 'Friday at 5:00 PM',
      explanation: 'All labor must be entered in ProCare by Friday at 5:00 PM. Late entry delays payroll processing and creates errors that require corrections.'
    },
    {
      id: 'q10',
      question: 'True or False: The AR Aging Report shows which families have outstanding balances and how long those balances have been unpaid.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'The AR Aging Report groups outstanding balances by time period (0–30 days, 31–60 days, 60+ days). It\'s the primary tool for identifying accounts at risk and prioritizing collection action.'
    },
  ],

  '4.4-quiz': [
    {
      id: 'q5',
      question: 'What action triggers a Warrant in Debt filing, and what is the maximum amount for Virginia small claims court?',
      type: 'multiple-choice',
      options: ['Any balance over $500 — filed in Charlottesville City Court', 'Balances over $1,000 — filed in Albemarle County General District Court', 'Unresolved balances after denial of care — up to $5,000 in Albemarle County General District Court', 'Any balance outstanding more than 90 days — filed through a collection agency only'],
      correctAnswer: 'Unresolved balances after denial of care — up to $5,000 in Albemarle County General District Court',
      explanation: 'BB can file a Warrant in Debt in Albemarle County General District Court for unresolved family balances up to $5,000. This does not require an attorney.'
    },
    {
      id: 'q6',
      question: 'True or False: The Director Packet is submitted once per week, every Thursday.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'The Director Packet is a weekly Thursday submission. It includes completed DORs, incident reports, next week\'s staff schedule, and any licensing correspondence.'
    },
    {
      id: 'q7',
      question: 'What is the re-registration fee structure at Bright Beginnings?',
      type: 'multiple-choice',
      options: ['$100 flat fee regardless of family size', '$300 for a single child, $500 for a family with two or more children', '$200 per child enrolled', 'No re-registration fee — only a new enrollment fee'],
      correctAnswer: '$300 for a single child, $500 for a family with two or more children',
      explanation: 'The enhancement (re-registration) fee is $300 for a single child and $500 for a family with two or more children. This is due annually in the child\'s anniversary enrollment month.'
    },
    {
      id: 'q8',
      question: 'What is the primary purpose of the Day 26 "tour follow-up blitz"?',
      type: 'multiple-choice',
      options: ['To remind current families of upcoming billing on Day 27', 'To contact prospective families who toured that month but haven\'t enrolled', 'To verify all pending enrollment paperwork is complete', 'To reach out to past families about re-enrollment'],
      correctAnswer: 'To contact prospective families who toured that month but haven\'t enrolled',
      explanation: 'Day 26 — three days before billing — is a natural urgency window to follow up with tours who haven\'t committed. "We have a spot available" is a genuine and compelling message before the month turns.'
    },
    {
      id: 'q9',
      question: 'True or False: Late fees are applied on Day 5 of each month alongside the denial-of-care deadline.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Late fees are applied on Day 1. By Day 5, the issue has escalated to denial of care. Late fees and denial of care are separate, sequential actions.'
    },
    {
      id: 'q10',
      question: 'The Day 23 tuition posting serves which primary purpose?',
      type: 'multiple-choice',
      options: ['To generate the monthly revenue report for ownership', 'To allow families to see upcoming charges and resolve rate discrepancies before the Day 27 auto-charge', 'To notify DSS of the following month\'s billing amounts', 'To trigger the enhancement fee for re-registering families'],
      correctAnswer: 'To allow families to see upcoming charges and resolve rate discrepancies before the Day 27 auto-charge',
      explanation: 'Posting tuition on Day 23 gives a 4-day window before the Day 27 auto-charge. Families can flag errors and directors can correct rates — preventing failed charges and family disputes.'
    },
  ],

  '4.6-quiz': [
    {
      id: 'q6',
      question: 'What is the Tuition Express Merchant ID for the Forest Lakes location?',
      type: 'multiple-choice',
      options: ['7657', '7660', '7673', '2935'],
      correctAnswer: '7657',
      explanation: 'Forest Lakes Merchant ID: CR-7657. Mill Creek: FL-7660 (note: FL=Forest Lakes abbreviation is reversed in some docs). Crozet: MC-7673. Memorize these for billing troubleshooting.'
    },
    {
      id: 'q7',
      question: 'What does the ^ (caret) symbol next to an amount in ProCare indicate for a CCA family?',
      type: 'multiple-choice',
      options: ['The amount is flagged for review', 'The amount is the DSS-covered portion, separate from the family co-pay', 'The account is in collections', 'The family has a payment plan in place'],
      correctAnswer: 'The amount is the DSS-covered portion, separate from the family co-pay',
      explanation: 'The ^ symbol in ProCare marks the CCA/DSS-covered portion of a family\'s charges. Missing this symbol causes overbilling errors — the system won\'t correctly calculate the family\'s co-pay.'
    },
    {
      id: 'q8',
      question: 'True or False: As of June 2025, a director may approve a new DSS enrollment if the family qualifies and has all required paperwork.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Effective June 2025, no new DSS enrollments may be approved without KP (ownership) approval. Existing DSS families continue normally. This is a policy freeze — not a permanent end to DSS.'
    },
    {
      id: 'q9',
      question: 'What is the CCA code for the Crozet location?',
      type: 'multiple-choice',
      options: ['2935', '9252', '9304', '7673'],
      correctAnswer: '9304',
      explanation: 'Crozet CCA code: MC-9304. Forest Lakes: FL-2935. Mill Creek: CR-9252. These codes are required for correct CCA billing setup in ProCare.'
    },
    {
      id: 'q10',
      question: 'When is the enhancement (re-registration) fee due for a returning family?',
      type: 'multiple-choice',
      options: ['January 1st of each year', 'On the child\'s original enrollment anniversary month', 'At the start of each new school year in September', 'Only when a family changes classrooms'],
      correctAnswer: 'On the child\'s original enrollment anniversary month',
      explanation: 'The enhancement fee is due in the child\'s enrollment anniversary month — not at a fixed calendar date. This spreads re-registration revenue across the year rather than concentrating it in one month.'
    },
  ],

  // ── MODULE 5 ────────────────────────────────────────────────────────────

  '5.1-quiz': [
    {
      id: 'q5',
      question: 'True or False: Self-reporting a compliance gap to your licensor before an inspection is viewed negatively by VDSS.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Self-reporting shows good faith and professionalism. A director who proactively identifies and corrects a gap — before an inspection finds it — builds a more cooperative relationship with their licensor.'
    },
    {
      id: 'q6',
      question: 'Who is the Bright Beginnings VDSS licensing contact for Charlottesville-area inspections?',
      type: 'multiple-choice',
      options: ['Jennifer Watkins', 'Chrystal King', 'Maria Hernandez', 'David Park'],
      correctAnswer: 'Chrystal King',
      explanation: 'Chrystal King (804-297-4469) is the BB licensing contact. Building a professional relationship with your licensor is part of effective compliance management.'
    },
    {
      id: 'q7',
      question: 'Which of the following items must be in every staff licensing file?',
      type: 'multiple-choice',
      options: ['Direct deposit form and W-4', 'TB screening, CPR certification, background check clearance, and orientation completion', 'Only the background check clearance', 'Performance reviews from the past two years'],
      correctAnswer: 'TB screening, CPR certification, background check clearance, and orientation completion',
      explanation: 'The licensing file requires TB screening, CPR/First Aid, background check clearance, and orientation hours. These are distinct from the BB HR file and are what licensing inspectors review.'
    },
    {
      id: 'q8',
      question: 'What Virginia regulation governs Child Day Center licensing standards?',
      type: 'multiple-choice',
      options: ['Title 19', '8VAC20-780', 'VA Code § 63.2-1701', 'VDSS Bulletin 22-C'],
      correctAnswer: '8VAC20-780',
      explanation: '8VAC20-780 is the Virginia Child Day Center Regulations document. Directors should be familiar with this regulation by name — it\'s what inspectors cite in any violation.'
    },
    {
      id: 'q9',
      question: 'How often must a licensing binder be reviewed and updated at a minimum?',
      type: 'multiple-choice',
      options: ['Annually before the scheduled inspection', 'Monthly — Day 3 of each month', 'Quarterly', 'Only when a new hire joins or leaves'],
      correctAnswer: 'Monthly — Day 3 of each month',
      explanation: 'The licensing binder review is a Day 3 monthly task. Monthly review catches expiring documents before they become violations — annual review is too infrequent.'
    },
    {
      id: 'q10',
      question: 'True or False: A licensing inspector may conduct an unannounced visit at any time, including in response to a parent complaint.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'Unannounced inspections are a standard VDSS practice. They\'re triggered by complaints, as routine follow-ups to prior violations, or randomly. Treat every day as inspection-ready.'
    },
  ],

  '5.2-quiz': [
    {
      id: 'q5',
      question: 'A child has been on an antibiotic for 48 hours for strep throat. They have no fever and seem well. Can they return to the center?',
      type: 'multiple-choice',
      options: ['No — they must wait a full week after a strep diagnosis', 'Yes — 48 hours on antibiotics with no fever is the standard', 'Only if they bring a doctor\'s note clearing them', 'Only if they wear a mask for the first day back'],
      correctAnswer: 'Yes — 48 hours on antibiotics with no fever is the standard',
      explanation: 'The 48-hour antibiotic rule with no fever is the standard return-to-care guideline for strep throat and most bacterial infections. Document the parent\'s confirmation in the child\'s daily note.'
    },
    {
      id: 'q6',
      question: 'True or False: Staff are permitted to give a child over-the-counter pain reliever (Tylenol/ibuprofen) without a Medication Authorization Form if the dose is the package\'s recommended amount.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'No medication — including OTC pain relievers — may be given without a completed Medication Authorization Form. Only prescription inhalers and EpiPens may be stored at the center without a full administration plan.'
    },
    {
      id: 'q7',
      question: 'What must be documented after every diapering procedure?',
      type: 'multiple-choice',
      options: ['Nothing — diapering is a routine task that doesn\'t require documentation', 'Time, child\'s name, and any unusual observations in the diapering log', 'Only unusual findings — normal changes don\'t need to be logged', 'The diaper brand used for billing purposes'],
      correctAnswer: 'Time, child\'s name, and any unusual observations in the diapering log',
      explanation: 'Every diaper change must be logged with time and child\'s name. The log is a licensing requirement and creates accountability for health monitoring. Unusual observations (rashes, marks) must also be noted.'
    },
    {
      id: 'q8',
      question: 'Bleach solution for sanitizing surfaces must be mixed at what concentration (ppm)?',
      type: 'multiple-choice',
      options: ['50 ppm', '100 ppm', '200 ppm', '500 ppm'],
      correctAnswer: '200 ppm',
      explanation: 'Surface sanitizing bleach solution is 200 ppm. The concentration for disinfecting (higher contamination risk areas) is different. All bleach solutions must be mixed fresh daily and labeled with the date.'
    },
    {
      id: 'q9',
      question: 'True or False: A parent may request that staff administer sunscreen to their child without a Medication Authorization Form.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Sunscreen is considered a topical product requiring written parent authorization before staff may apply it. A blanket authorization form signed at enrollment can cover this, but verbal permission on a given day is not sufficient.'
    },
    {
      id: 'q10',
      question: 'What is the correct response if a staff member notices unexplained bruising on a child during a routine diaper change?',
      type: 'multiple-choice',
      options: ['Ask the child about it and document their response', 'Document what was observed with description and location, report to the director immediately, and the director initiates the mandatory reporter process', 'Call the parent immediately to ask for an explanation before reporting', 'Monitor for additional signs before taking action'],
      correctAnswer: 'Document what was observed with description and location, report to the director immediately, and the director initiates the mandatory reporter process',
      explanation: 'Any unexplained injury or bruising observed on a child must be immediately reported to the director. The director then follows the mandatory reporter protocol — including calling the hotline if there\'s reasonable suspicion. Staff should never investigate independently.'
    },
  ],

  '5.4-quiz': [
    {
      id: 'q5',
      question: 'True or False: If a fire alarm activates during an active-shooter situation reported nearby, you should evacuate per normal fire drill protocol.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'In an active-shooter situation, a fire alarm may be used to draw people outside. Do not automatically evacuate — call 911 and follow law enforcement guidance. The normal response protocols are secondary to law enforcement direction.'
    },
    {
      id: 'q6',
      question: 'Where must emergency contact information be located for each child?',
      type: 'multiple-choice',
      options: ['In the director\'s office only', 'In a central binder at the front desk', 'Accessible in each classroom — not only in the office', 'On the Tadpoles app which staff can access from any device'],
      correctAnswer: 'Accessible in each classroom — not only in the office',
      explanation: 'Emergency contact information must be accessible in every classroom. In an emergency evacuation, teachers cannot leave the group to retrieve files from the office.'
    },
    {
      id: 'q7',
      question: 'What is the required outdoor square footage per child for a Virginia childcare outdoor play area?',
      type: 'multiple-choice',
      options: ['35 sq ft', '50 sq ft', '75 sq ft', '100 sq ft'],
      correctAnswer: '75 sq ft',
      explanation: 'Virginia requires 75 square feet of outdoor play space per child. Indoor requirement is 35 sq ft per child. Both are measured usable space — not total square footage.'
    },
    {
      id: 'q8',
      question: 'What action should a director take if the building loses power for more than 4 hours in winter?',
      type: 'multiple-choice',
      options: ['Continue operations using emergency lighting', 'Contact ownership and prepare for potential early closure if temperature drops below 50°F', 'Send all children home immediately', 'Move all children to one classroom to conserve heat'],
      correctAnswer: 'Contact ownership and prepare for potential early closure if temperature drops below 50°F',
      explanation: 'Centers must close if indoor temperature drops below 50°F or rises above 85°F. A 4-hour winter outage warrants immediate ownership notification and preparation for potential closure.'
    },
    {
      id: 'q9',
      question: 'True or False: Lockdown drills must be conducted and documented at least once per quarter.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'Lockdown (and other emergency) drills are required quarterly. Fire drills are monthly. All drills must be documented in the licensing binder with date, time, and participant count.'
    },
    {
      id: 'q10',
      question: 'What is the correct procedure when an unknown adult attempts to enter the building during operating hours?',
      type: 'multiple-choice',
      options: ['Greet them warmly and ask their purpose — if they seem harmless, let them in', 'Require photo ID, photograph it, have them sign the visitor log, and verify their purpose before allowing entry beyond the lobby', 'Lock the door and call 911 immediately', 'Have a teacher come to the front to escort them if needed'],
      correctAnswer: 'Require photo ID, photograph it, have them sign the visitor log, and verify their purpose before allowing entry beyond the lobby',
      explanation: 'Every non-employee entering the building follows the same protocol: photo ID required, photographed, visitor log signed. No exceptions — not for delivery drivers, vendors, or apparent parents of enrolled children.'
    },
  ],

  '5.5-quiz': [
    {
      id: 'q6',
      question: 'True or False: Infant cribs may be shared between children if both children are healthy and there are no infections present.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Each infant must have their own designated crib. Crib sharing is never permitted — it\'s both a licensing violation and a safety risk regardless of health status.'
    },
    {
      id: 'q7',
      question: 'What is required on the infant room whiteboard at all times?',
      type: 'multiple-choice',
      options: ['Daily attendance only', 'Current sleep/wake times and feeding log for each infant in the room', 'Staff names and ratios for the current shift', 'Emergency contact numbers for all families'],
      correctAnswer: 'Current sleep/wake times and feeding log for each infant in the room',
      explanation: 'The infant room whiteboard must be current at all times with each infant\'s sleep and feeding information. Inspectors check this. A blank or outdated whiteboard is a common deficiency.'
    },
    {
      id: 'q8',
      question: 'What items are permitted in the center medicine box?',
      type: 'multiple-choice',
      options: ['Any prescription medication with a signed authorization form', 'OTC pain relievers, prescription medications, inhalers, and EpiPens', 'Prescription inhalers and EpiPens only', 'Any medication brought in by a parent, properly labeled'],
      correctAnswer: 'Prescription inhalers and EpiPens only',
      explanation: 'The medicine box is restricted to prescription inhalers and EpiPens only. No OTC medications, vitamins, or other items may be stored there. A family asking staff to administer Tylenol requires a separate, formal medication authorization process.'
    },
    {
      id: 'q9',
      question: 'The 72-hour emergency kit is required to contain which of the following?',
      type: 'multiple-choice',
      options: ['First aid supplies only', 'Water, non-perishable food, first aid supplies, flashlights, blankets, and critical child/staff information', 'Emergency contact lists and medication records', 'Fire extinguisher, AED, and first aid kit'],
      correctAnswer: 'Water, non-perishable food, first aid supplies, flashlights, blankets, and critical child/staff information',
      explanation: 'The 72-hour emergency kit must support the full center population for 72 hours without outside resources. It includes water, food, medical supplies, light sources, and documentation — not just a first aid kit.'
    },
    {
      id: 'q10',
      question: 'True or False: Nap mats used by different children must be sanitized between uses.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'Nap mats must be sanitized between uses by different children. Each child should have a designated mat stored with their belongings, or mats must be sanitized according to the bleach concentration table before reassignment.'
    },
  ],

  '5.7-quiz': [
    {
      id: 'q5',
      question: 'How far in advance should a field trip be planned and all logistics confirmed?',
      type: 'multiple-choice',
      options: ['One week', 'Two weeks', 'One month', 'Two months'],
      correctAnswer: 'One month',
      explanation: 'Field trips require a one-month planning timeline. This allows time to collect parent permission slips, arrange transportation, confirm venue, manage staffing, and prepare communication to families.'
    },
    {
      id: 'q6',
      question: 'True or False: A parent who verbally confirms they will bring a car seat can transport additional children on a field trip without completing a Volunteer Driver Form.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'A Volunteer Driver Form must be on file before any parent drives children — regardless of verbal commitments about car seats. The form includes proof of insurance and valid driver\'s license verification.'
    },
    {
      id: 'q7',
      question: 'What is the minimum group size required to use an Albemarle County school bus for a field trip?',
      type: 'multiple-choice',
      options: ['1 or more', '3 or more', '4 or more', '8 or more'],
      correctAnswer: '4 or more',
      explanation: 'Albemarle County school buses are available for groups of 4 or more children. Groups of fewer than 4 must use alternative transportation options.'
    },
    {
      id: 'q8',
      question: 'Which Virginia regulation specifically governs field trip requirements for licensed childcare centers?',
      type: 'multiple-choice',
      options: ['8VAC20-780-460', '8VAC20-780-580', 'Title 22, Section 12B', 'VA Code § 63.2-1733'],
      correctAnswer: '8VAC20-780-580',
      explanation: '8VAC20-780-580 is the specific Virginia regulation governing field trip requirements. Directors should know this citation by number — it comes up in licensing discussions and parent questions about field trip procedures.'
    },
    {
      id: 'q9',
      question: 'True or False: Staff must maintain normal classroom ratios during a field trip.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'Virginia ratio requirements apply everywhere children are in care — including off-site field trips. You cannot take 20 preschoolers to a farm with 2 staff and claim that ratios don\'t apply away from the building.'
    },
    {
      id: 'q10',
      question: 'What is required on every child permission slip for a field trip to be valid?',
      type: 'multiple-choice',
      options: ['Child\'s name, date, and parent signature', 'Child\'s name, destination, date, transportation method, and parent signature — per 8VAC20-780-580', 'A notarized parent signature only', 'Parent signature and a copy of the child\'s health form'],
      correctAnswer: 'Child\'s name, destination, date, transportation method, and parent signature — per 8VAC20-780-580',
      explanation: 'Per 8VAC20-780-580, a valid field trip permission slip must include the child\'s name, destination, date, transportation method, and parent signature. Incomplete slips do not satisfy the regulation.'
    },
  ],

  // ── MODULE 6 ────────────────────────────────────────────────────────────

  '6.1-quiz': [
    {
      id: 'q5',
      question: 'True or False: A director should personally call every new family on their child\'s first day.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'The Day 1 check-in is a staff text within 30 minutes of drop-off. The personal director call happens on Day 2. This distinction matters — Day 1 is immediate reassurance; Day 2 is relationship-building.'
    },
    {
      id: 'q6',
      question: 'What is the "30-minute text" protocol for new families?',
      type: 'multiple-choice',
      options: ['Text parents to confirm pickup instructions within 30 minutes of closing', 'Send a brief update with the child\'s status within 30 minutes of their first drop-off', 'Respond to any parent Tadpoles message within 30 minutes', 'Complete the DOR within 30 minutes of last child departing'],
      correctAnswer: 'Send a brief update with the child\'s status within 30 minutes of their first drop-off',
      explanation: 'Every new family gets a text within 30 minutes of their first drop-off — a brief, warm update on how the child is doing. This single action dramatically reduces parent anxiety and sets a trust foundation.'
    },
    {
      id: 'q7',
      question: 'When a child has a minor fall, at what point should the parent be called?',
      type: 'multiple-choice',
      options: ['Only if the child cries for more than 5 minutes', 'As soon as the incident log is complete — before pickup', 'At pickup — verbally, no documentation needed for minor incidents', 'Only if a visible mark (bruise, bump) develops'],
      correctAnswer: 'As soon as the incident log is complete — before pickup',
      explanation: 'Parents should be notified before pickup whenever a fall or incident occurs — even minor ones. Finding out at pickup from a teacher rather than getting a proactive call from the director is a trust-damager.'
    },
    {
      id: 'q8',
      question: 'True or False: The best time to ask a new family for a referral is during their enrollment meeting.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Referral requests are most effective after the family has had a positive experience — typically at the 30-day mark or after the child is well-settled. Asking at enrollment is premature; the family hasn\'t experienced the center yet.'
    },
    {
      id: 'q9',
      question: 'A parent leaves a voicemail at 8 AM with a billing question. It\'s a hectic morning. What must happen by 9 AM?',
      type: 'multiple-choice',
      options: ['A full answer to their question with documentation', 'An acknowledgment of the message and a timeline for the full answer', 'A call back whenever the morning rush is over', 'A text message asking them to resend the question via email'],
      correctAnswer: 'An acknowledgment of the message and a timeline for the full answer',
      explanation: 'The 1-hour turnaround rule requires acknowledgment within 60 minutes — not necessarily a complete answer. "I got your message and will call you back at 10:30 with the full details" satisfies the rule.'
    },
    {
      id: 'q10',
      question: 'True or False: A director should match a parent\'s emotional intensity when they are upset, to show empathy.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'The director\'s job is to de-escalate, not match intensity. A calm, composed tone communicates control and invites the parent to regulate. Matching their energy escalates the situation and reduces the chance of resolution.'
    },
  ],

  '6.3-quiz': [
    {
      id: 'q5',
      question: 'A parent says "I\'ve heard from other parents that Ms. Johnson isn\'t paying attention to the kids." What is the correct response?',
      type: 'multiple-choice',
      options: ['Tell them you\'ll look into it and share what you find', 'Explain that you can\'t discuss other parents\' observations, then directly investigate the concern yourself', 'Defend Ms. Johnson based on your own observations', 'Ask the parent to identify which other parents made the complaint'],
      correctAnswer: 'Explain that you can\'t discuss other parents\' observations, then directly investigate the concern yourself',
      explanation: 'You can\'t share what other families have said, and you don\'t dismiss the concern. Acknowledge it, commit to looking into it personally, and follow up with the parent within your 1-hour window.'
    },
    {
      id: 'q6',
      question: 'True or False: It is appropriate to say "I understand" when a parent shares a concern, even if you disagree with their interpretation of events.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: '"I understand" acknowledges that you\'ve heard them — it doesn\'t mean you agree. Acknowledging before responding is the foundation of every difficult conversation structure. Jumping to defense before acknowledgment escalates conflict.'
    },
    {
      id: 'q7',
      question: 'A parent threatens to post a negative Google review unless you give them a billing credit. What is the correct response?',
      type: 'multiple-choice',
      options: ['Offer the credit to avoid the review — reputation is more valuable than one credit', 'Acknowledge the frustration, address the legitimate billing issue if it exists, and let them know reviews are their right but won\'t change policy decisions', 'Tell them their review will be reported as extortion', 'Escalate directly to ownership without addressing the parent'],
      correctAnswer: 'Acknowledge the frustration, address the legitimate billing issue if it exists, and let them know reviews are their right but won\'t change policy decisions',
      explanation: 'Never let review threats drive billing decisions. Address any legitimate underlying issue, but make clear that the policy applies to everyone. Giving in to threats invites more of the same behavior.'
    },
    {
      id: 'q8',
      question: 'After a hard conversation with a staff member, what is the required documentation step?',
      type: 'multiple-choice',
      options: ['Nothing — verbal conversations don\'t require documentation', 'A brief email to the staff member summarizing what was discussed', 'A ProCare documentation entry with the date, topic, and outcome', 'A signed acknowledgment from the staff member only'],
      correctAnswer: 'A ProCare documentation entry with the date, topic, and outcome',
      explanation: 'Every significant staff conversation — corrective or otherwise — must be documented in ProCare the same day. The entry creates a record that protects both the center and the employee in any future dispute.'
    },
    {
      id: 'q9',
      question: 'True or False: When a parent gossips about another family to you, the appropriate response is to redirect and decline to engage.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'Directors never participate in gossip about families. Redirect professionally: "I can\'t speak to other families\' situations, but if you have a concern about your own experience here, I\'d love to talk about that." Participating even passively creates trust and liability problems.'
    },
    {
      id: 'q10',
      question: 'What is the maximum time window for following up after a difficult parent conversation?',
      type: 'multiple-choice',
      options: ['48 hours', '1 business day', '1 hour', 'End of the same day'],
      correctAnswer: '1 hour',
      explanation: 'The 1-hour resolution window applies to difficult conversations too. After an irate parent interaction, the director circles back within 1 hour with an update or a confirmed timeline. Silence after conflict is interpreted as indifference.'
    },
  ],

  '6.4-quiz': [
    {
      id: 'q5',
      question: 'True or False: A negative Google review with false information can be legally required to be removed.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Google rarely removes reviews even if the content is disputed. The correct response is a professional public reply that demonstrates your values and invites resolution — not a removal request that rarely succeeds.'
    },
    {
      id: 'q6',
      question: 'A Tadpoles parent message reads: "I saw the classroom today and it looked messy. Is this normal?" What is the ideal response?',
      type: 'multiple-choice',
      options: ['Explain that active learning environments naturally look busy', 'Apologize and promise it won\'t happen again', 'Acknowledge the concern, follow up on what they observed, and report back with what you found', 'Transfer the message to the lead teacher to handle'],
      correctAnswer: 'Acknowledge the concern, follow up on what they observed, and report back with what you found',
      explanation: 'The director responds personally, investigates, and follows up. Dismissing it as "normal" or deflecting to the teacher misses an opportunity to demonstrate responsiveness and catch a real issue.'
    },
    {
      id: 'q7',
      question: 'What is the Canva login username for Bright Beginnings social and newsletter content?',
      type: 'multiple-choice',
      options: ['bbdirector@gmail.com', 'brightbeginnings1984@gmail.com', 'mollypetchel@gmail.com', 'robhichens84@gmail.com'],
      correctAnswer: 'mollypetchel@gmail.com',
      explanation: 'Canva login: mollypetchel@gmail.com / BBIteach1984!. This is the shared account used for all Bright Beginnings newsletters, social content, and marketing materials.'
    },
    {
      id: 'q8',
      question: 'True or False: Posting 5+ times per week on social media is always better than 2–3 times per week for a preschool audience.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Quality over quantity. For a preschool audience, 2–3 posts per week of genuine, warm content outperforms 5+ generic or filler posts. Oversaturation leads to unfollows; consistent, authentic content builds community.'
    },
    {
      id: 'q9',
      question: 'What type of social media content performs best for preschool parent audiences?',
      type: 'multiple-choice',
      options: ['Formal school announcements and policy updates', 'Promotional content about tuition and enrollment', 'Authentic photos and videos of children engaged in learning activities (with proper photo permissions)', 'Staff bios and center history posts'],
      correctAnswer: 'Authentic photos and videos of children engaged in learning activities (with proper photo permissions)',
      explanation: 'Photos and videos of children learning — especially candid, joyful moments — consistently outperform all other content types. Parents share this content with friends, which is the highest-value organic marketing available.'
    },
    {
      id: 'q10',
      question: 'True or False: Pediatrician office partnerships generate enrollment leads because pediatricians actively recommend Bright Beginnings to parents.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Pediatricians don\'t actively sell BB. The value of the partnership is passive referrals — a flyer in the waiting room, a bulletin board placement, or a word-of-mouth mention when a parent asks about childcare. It\'s brand visibility, not active sales.'
    },
  ],

  '6.5-quiz': [
    {
      id: 'q5',
      question: 'True or False: The peak enrollment period at Bright Beginnings is in November and December.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'The peak enrollment surge months are March and August. November/December are slower for new enrollments as families have typically made childcare decisions for the year.'
    },
    {
      id: 'q6',
      question: 'What is the correct tone for a staff transition letter sent to families?',
      type: 'multiple-choice',
      options: ['Apologetic — acknowledge that this is difficult for the class', 'Explanatory — give the reason the teacher is leaving so families understand', 'Positive and forward-looking — celebrate the teacher and introduce the replacement in the same message', 'Neutral and brief — families don\'t need details'],
      correctAnswer: 'Positive and forward-looking — celebrate the teacher and introduce the replacement in the same message',
      explanation: 'Staff transition letters follow a specific tone formula: positive framing, no explanation of why the teacher is leaving, celebration of their contributions, and immediate introduction of the replacement. Separating these two messages creates anxiety.'
    },
    {
      id: 'q7',
      question: 'A toddler bites another child for the third time this week. What is the multi-step response?',
      type: 'multiple-choice',
      options: ['Call the parents of both children and schedule a conference for the biting child', 'Document the incident, notify both families, consult the lead teacher on antecedent patterns, and consider a behavior plan', 'Send the biting child home for the day', 'Separate the biting child from group activities until the behavior stops'],
      correctAnswer: 'Document the incident, notify both families, consult the lead teacher on antecedent patterns, and consider a behavior plan',
      explanation: 'Toddler biting is developmentally common but requires systematic response: document everything, notify families (neither child is named in communications to the other family), analyze the pattern, and develop a plan with the teacher.'
    },
    {
      id: 'q8',
      question: 'True or False: A director may share the name of the biting child with the parents of the child who was bitten.',
      type: 'true-false',
      correctAnswer: 'False',
      explanation: 'Student confidentiality applies to incident communication between families. Parents of the bitten child are told their child was bitten and what BB is doing about it — never the other child\'s name.'
    },
    {
      id: 'q9',
      question: 'At public events (Easter Egg Hunt, Fall Festival), what information should be captured from prospective families?',
      type: 'multiple-choice',
      options: ['Just their email for the newsletter', 'Name, phone number, email, and child\'s age — followed up within 48 hours', 'Child\'s age and current childcare provider', 'Full enrollment interest form on the spot'],
      correctAnswer: 'Name, phone number, email, and child\'s age — followed up within 48 hours',
      explanation: 'Events are enrollment opportunities. Capture the minimum viable information: name, phone, email, child\'s age. Follow up within 48 hours while the experience is fresh. A sign-in sheet or iPad form works best.'
    },
    {
      id: 'q10',
      question: 'How many months does the Bright Beginnings seasonal operations guide cover?',
      type: 'multiple-choice',
      options: ['Six months (September through February)', 'Nine months (September through May)', 'Ten months (August through May)', 'All twelve months of the year'],
      correctAnswer: 'All twelve months of the year',
      explanation: 'The seasonal operations guide covers all 12 months. Childcare doesn\'t have an "off season" — there are enrollment cycles, events, compliance milestones, and leadership priorities in every calendar month.'
    },
  ],

}

// ── Apply patches ──────────────────────────────────────────────────────────
let patched = 0
let skipped = 0

for (const [moduleDir, content] of [
  ['module1', JSON.parse(readFileSync(`${ROOT}/module1/content.json`, 'utf8'))],
  ['module2', JSON.parse(readFileSync(`${ROOT}/module2/content.json`, 'utf8'))],
  ['module3', JSON.parse(readFileSync(`${ROOT}/module3/content.json`, 'utf8'))],
  ['module4', JSON.parse(readFileSync(`${ROOT}/module4/content.json`, 'utf8'))],
  ['module5', JSON.parse(readFileSync(`${ROOT}/module5/content.json`, 'utf8'))],
  ['module6', JSON.parse(readFileSync(`${ROOT}/module6/content.json`, 'utf8'))],
]) {
  const arr = Array.isArray(content) ? content : (content.sections || [])
  let modified = false

  for (const section of arr) {
    if (section.type !== 'quiz') continue
    const newQs = NEW_QUESTIONS[section.id]
    if (!newQs) { skipped++; continue }

    const existingIds = new Set(section.questions.map(q => q.id))
    const toAdd = newQs.filter(q => !existingIds.has(q.id))

    if (toAdd.length === 0) {
      console.log(`  ✓ ${moduleDir}/${section.id} — already up to date`)
      continue
    }

    section.questions.push(...toAdd)
    console.log(`  ✚ ${moduleDir}/${section.id} — added ${toAdd.length} questions (now ${section.questions.length})`)
    modified = true
    patched++
  }

  if (modified) {
    writeFileSync(`${ROOT}/${moduleDir}/content.json`, JSON.stringify(content, null, 2))
  }
}

console.log(`\nDone: ${patched} quizzes patched, ${skipped} skipped.`)
