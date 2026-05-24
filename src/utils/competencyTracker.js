import { CATEGORIES } from '../data/competenciesData'

const STORAGE_KEY = 'bb-director-competencies'

// ── Initialise an empty store from the data shape ──────────────────────────
function buildEmptyItems() {
  const items = {}
  CATEGORIES.forEach(cat => {
    cat.items.forEach(item => {
      items[item.id] = {
        id: item.id,
        categoryId: cat.id,
        introduced: false,
        introducedDate: null,
        completed: false,
        completedDate: null,
      }
    })
  })
  return items
}

export function initializeCompetencies() {
  const data = { lastUpdated: new Date().toISOString(), items: buildEmptyItems() }
  saveCompetencies(data)
  return data
}

// ── Load / Save ────────────────────────────────────────────────────────────
export function loadCompetencies() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initializeCompetencies()
    const stored = JSON.parse(raw)
    // Ensure any new items added after first load are present
    const base = buildEmptyItems()
    const merged = { ...base, ...stored.items }
    return { ...stored, items: merged }
  } catch {
    return initializeCompetencies()
  }
}

export function saveCompetencies(data) {
  try {
    data.lastUpdated = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* storage full */ }
}

// ── Actions ────────────────────────────────────────────────────────────────
export function markIntroduced(data, itemId) {
  const next = structuredClone(data)
  next.items[itemId].introduced = true
  next.items[itemId].introducedDate = new Date().toISOString()
  saveCompetencies(next)
  return next
}

export function markCompleted(data, itemId) {
  const next = structuredClone(data)
  // Auto-set introduced if not already
  if (!next.items[itemId].introduced) {
    next.items[itemId].introduced = true
    next.items[itemId].introducedDate = new Date().toISOString()
  }
  next.items[itemId].completed = true
  next.items[itemId].completedDate = new Date().toISOString()
  saveCompetencies(next)
  return next
}

export function uncheckCompleted(data, itemId) {
  const next = structuredClone(data)
  next.items[itemId].completed = false
  next.items[itemId].completedDate = null
  saveCompetencies(next)
  return next
}

export function uncheckIntroduced(data, itemId) {
  // Cascades — also clears completed
  const next = structuredClone(data)
  next.items[itemId].introduced = false
  next.items[itemId].introducedDate = null
  next.items[itemId].completed = false
  next.items[itemId].completedDate = null
  saveCompetencies(next)
  return next
}

export function resetAllCompetencies() {
  localStorage.removeItem(STORAGE_KEY)
  return initializeCompetencies()
}

// ── Progress helpers ───────────────────────────────────────────────────────
export function getOverallProgress(data) {
  const allItems = Object.values(data.items)
  if (!allItems.length) return { completed: 0, total: 0, pct: 0 }
  const completed = allItems.filter(i => i.completed).length
  return { completed, total: allItems.length, pct: Math.round((completed / allItems.length) * 100) }
}

export function getCategoryProgress(data, categoryId) {
  const catItems = Object.values(data.items).filter(i => i.categoryId === categoryId)
  if (!catItems.length) return { completed: 0, total: 0, pct: 0 }
  const completed = catItems.filter(i => i.completed).length
  return { completed, total: catItems.length, pct: Math.round((completed / catItems.length) * 100) }
}

// Quick read for sidebar badge — reads directly from storage
export function getQuickPct() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return 0
    const data = JSON.parse(raw)
    const items = Object.values(data.items || {})
    if (!items.length) return 0
    const done = items.filter(i => i.completed).length
    const total = CATEGORIES.reduce((s, c) => s + c.items.length, 0)
    return Math.round((done / total) * 100)
  } catch { return 0 }
}

// ── Date formatters ────────────────────────────────────────────────────────
export function fmtDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
