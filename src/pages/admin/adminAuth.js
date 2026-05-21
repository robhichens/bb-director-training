// Simple hardcoded admin credentials — kept server-side if this ever moves to SSR,
// but for now it's a lightweight gate for a single trusted admin.
const ADMIN_USER = 'robhichens13'
const ADMIN_PASS = 'bbtraining1984!'
const SESSION_KEY = 'bb-admin-session'

export function checkAdminCredentials(username, password) {
  return username === ADMIN_USER && password === ADMIN_PASS
}

export function setAdminSession() {
  sessionStorage.setItem(SESSION_KEY, 'authed')
}

export function clearAdminSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function isAdminAuthed() {
  return sessionStorage.getItem(SESSION_KEY) === 'authed'
}
