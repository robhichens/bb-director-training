/**
 * taskStore.js — daily/monthly task completion persistence
 *
 * Two scopes:
 *   'daily'   — resets each calendar day (Today section)
 *   'monthly' — persists for the full calendar month (Month Focus section)
 *
 * Store shape in localStorage ('bb-daily-tasks'):
 * {
 *   daily:   { "2026-05-22": { "monday-roll-call": { checked: true, checkedAt: "ISO" } } }
 *   monthly: { "2026-05":    { "date-27-billing-day": { checked: true, checkedAt: "ISO" } } }
 * }
 */

const TASK_KEY = 'bb-daily-tasks'

function getStore() {
  try { return JSON.parse(localStorage.getItem(TASK_KEY) || '{}') }
  catch { return {} }
}

function saveStore(store) {
  try { localStorage.setItem(TASK_KEY, JSON.stringify(store)) }
  catch { /* storage full — silently ignore */ }
}

export function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function scopeKey(scope) {
  return scope === 'daily' ? getTodayKey() : getMonthKey()
}

export function isChecked(tipId, scope) {
  const store = getStore()
  return !!(store[scope]?.[scopeKey(scope)]?.[tipId]?.checked)
}

export function getCheckedAt(tipId, scope) {
  const store = getStore()
  return store[scope]?.[scopeKey(scope)]?.[tipId]?.checkedAt ?? null
}

export function checkTask(tipId, scope) {
  const store = getStore()
  if (!store[scope]) store[scope] = {}
  const key = scopeKey(scope)
  if (!store[scope][key]) store[scope][key] = {}
  store[scope][key][tipId] = { checked: true, checkedAt: new Date().toISOString() }
  saveStore(store)
}

export function uncheckTask(tipId, scope) {
  const store = getStore()
  const key = scopeKey(scope)
  if (store[scope]?.[key]?.[tipId]) {
    delete store[scope][key][tipId]
    saveStore(store)
  }
}

/** Returns the full { tipId: { checked, checkedAt } } map for today/thisMonth */
export function getAllChecked(scope) {
  const store = getStore()
  return store[scope]?.[scopeKey(scope)] ?? {}
}

/** Format a timestamp for display: "9:14 AM" */
export function formatCheckedAt(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

/** Format a month timestamp: "May 22 at 9:14 AM" */
export function formatCheckedAtFull(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
         ' at ' +
         d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
