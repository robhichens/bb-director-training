// Admin auth is validated server-side by the `admin-progress` Netlify function,
// which checks credentials against ADMIN_USERNAME / ADMIN_PASSWORD env vars.
// No credentials are hardcoded in the client bundle.
//
// On successful login we keep the credentials in sessionStorage (cleared when the
// browser closes) so the dashboard can authenticate its data request to the function.

const SESSION_KEY = 'bb-admin-session'
const CRED_KEY    = 'bb-admin-cred'

const ENDPOINT = '/.netlify/functions/admin-progress'

// Validate credentials against the server. Returns true on success.
export async function checkAdminCredentials(username, password) {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, action: 'login' }),
    })
    return res.ok
  } catch {
    return false
  }
}

export function setAdminSession(username, password) {
  sessionStorage.setItem(SESSION_KEY, 'authed')
  sessionStorage.setItem(CRED_KEY, JSON.stringify({ username, password }))
}

export function getAdminCred() {
  try {
    return JSON.parse(sessionStorage.getItem(CRED_KEY) || 'null')
  } catch {
    return null
  }
}

export function clearAdminSession() {
  sessionStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(CRED_KEY)
}

export function isAdminAuthed() {
  return sessionStorage.getItem(SESSION_KEY) === 'authed'
}
