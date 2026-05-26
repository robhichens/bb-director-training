// Platform integration for bb-director-training
// When opened from bb-platform with ?uid=, this module stores the uid in
// sessionStorage and notifies bb-platform when training milestones are reached.

const PLATFORM_UID_KEY     = 'bb-platform-uid'
const PLATFORM_STARTED_KEY = 'bb-platform-started'
const PLATFORM_DONE_KEY    = 'bb-platform-completed'

const RECORD_URL = 'https://us-central1-bb-platform-5c296.cloudfunctions.net/recordTrainingCompletion'

const MODULE_ORDER = ['module1', 'module2', 'module3', 'module4', 'module5', 'module6', 'module7']

// ── Getters / setters ─────────────────────────────────────────────────────────

export function getPlatformUid() {
  try { return sessionStorage.getItem(PLATFORM_UID_KEY) || null } catch { return null }
}

export function setPlatformUid(uid) {
  try { sessionStorage.setItem(PLATFORM_UID_KEY, uid) } catch {}
}

export function clearPlatformUid() {
  try {
    sessionStorage.removeItem(PLATFORM_UID_KEY)
    sessionStorage.removeItem(PLATFORM_STARTED_KEY)
    sessionStorage.removeItem(PLATFORM_DONE_KEY)
  } catch {}
}

// ── Progress helpers ──────────────────────────────────────────────────────────

export function isAllModulesComplete(progress) {
  return MODULE_ORDER.every(id => progress[id]?.status === 'completed')
}

// ── Sync to bb-platform ───────────────────────────────────────────────────────

async function postRecord(uid, event) {
  try {
    await fetch(RECORD_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid,
        moduleId:    'director-module-1',
        moduleTitle: 'Director Operations Manual',
        event,
      }),
    })
  } catch (e) {
    console.warn('Platform sync failed (non-critical):', e)
  }
}

/**
 * Call once when the app loads in platform mode.
 * Creates a `started` record in bb-platform Firestore (idempotent per session).
 */
export function syncStarted() {
  const uid = getPlatformUid()
  if (!uid) return
  if (sessionStorage.getItem(PLATFORM_STARTED_KEY)) return
  sessionStorage.setItem(PLATFORM_STARTED_KEY, '1')
  postRecord(uid, 'started')
}

/**
 * Call when all 7 modules are complete.
 * Sets `completedAt` in bb-platform Firestore (idempotent per session).
 */
export function syncCompleted() {
  const uid = getPlatformUid()
  if (!uid) return
  if (sessionStorage.getItem(PLATFORM_DONE_KEY)) return
  sessionStorage.setItem(PLATFORM_DONE_KEY, '1')
  postRecord(uid, 'completed')
}
