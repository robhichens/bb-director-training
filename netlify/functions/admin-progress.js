import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const JSON_HEADERS = { 'Content-Type': 'application/json' }

// Init the Admin SDK once per warm container
function getDb() {
  if (!getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT
    if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT not set')
    const serviceAccount = JSON.parse(raw)
    initializeApp({ credential: cert(serviceAccount) })
  }
  return getFirestore()
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Invalid request body' }) }
  }

  const { username, password, action } = body

  // ── Server-side credential check ──────────────────────────────
  const okUser = process.env.ADMIN_USERNAME
  const okPass = process.env.ADMIN_PASSWORD
  if (!okUser || !okPass) {
    return { statusCode: 500, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Admin auth is not configured on the server.' }) }
  }
  if (username !== okUser || password !== okPass) {
    return { statusCode: 401, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Invalid username or password.' }) }
  }

  // Login-only validation (no data needed)
  if (action === 'login') {
    return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify({ ok: true }) }
  }

  // ── Read all progress via Admin SDK (bypasses security rules) ──
  try {
    const db   = getDb()
    const snap = await db.collection('userProgress').get()
    const users = snap.docs.map(d => {
      const data = d.data()
      return {
        id: d.id,
        ...data,
        // Convert Firestore Timestamp → epoch millis so it survives JSON
        lastUpdated: data.lastUpdated?.toMillis ? data.lastUpdated.toMillis() : null,
      }
    })
    return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify({ users }) }
  } catch (err) {
    console.error('admin-progress error:', err.message)
    return { statusCode: 500, headers: JSON_HEADERS, body: JSON.stringify({ error: 'Failed to load progress data.' }) }
  }
}
