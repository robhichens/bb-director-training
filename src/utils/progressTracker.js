const USER_KEY     = 'bb-director-user'
const PROGRESS_KEY = 'bb-director-progress'

const MODULE_ORDER = ['module1', 'module2', 'module3', 'module4', 'module5', 'module6', 'module7']

const defaultProgress = () =>
  MODULE_ORDER.reduce((acc, id, idx) => {
    acc[id] = {
      status: idx === 0 ? 'not-started' : 'locked',
      sectionsCompleted: [],
      currentSection: null,
      quizScores: {},
      completedAt: null,
    }
    return acc
  }, {})

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearUser() {
  localStorage.removeItem(USER_KEY)
}

export function getProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return defaultProgress()
    const stored = JSON.parse(raw)
    // Ensure all modules present (handles schema updates)
    const base = defaultProgress()
    const merged = { ...base, ...stored }
    // Migration: unlock next module if prior module is completed but next is still locked
    MODULE_ORDER.forEach((id, idx) => {
      if (merged[id]?.status === 'completed' && idx < MODULE_ORDER.length - 1) {
        const nextId = MODULE_ORDER[idx + 1]
        if (merged[nextId]?.status === 'locked') {
          merged[nextId] = { ...merged[nextId], status: 'not-started' }
        }
      }
    })
    return merged
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function clearProgress() {
  localStorage.removeItem(PROGRESS_KEY)
}

export function markSectionComplete(progress, moduleId, sectionId) {
  const mod = { ...progress[moduleId] }
  if (!mod.sectionsCompleted.includes(sectionId)) {
    mod.sectionsCompleted = [...mod.sectionsCompleted, sectionId]
  }
  if (mod.status === 'not-started' || mod.status === 'locked') {
    mod.status = 'in-progress'
  }
  return { ...progress, [moduleId]: mod }
}

export function saveQuizScore(progress, moduleId, quizId, score, passed) {
  const mod = { ...progress[moduleId] }
  mod.quizScores = {
    ...mod.quizScores,
    [quizId]: {
      score,
      passed,
      attempts: (mod.quizScores[quizId]?.attempts ?? 0) + 1,
      lastAttempt: new Date().toISOString(),
    },
  }
  return { ...progress, [moduleId]: mod }
}

export function markModuleComplete(progress, moduleId) {
  const updated = { ...progress }
  updated[moduleId] = {
    ...updated[moduleId],
    status: 'completed',
    completedAt: new Date().toISOString(),
  }

  // Unlock next module
  const idx = MODULE_ORDER.indexOf(moduleId)
  if (idx >= 0 && idx < MODULE_ORDER.length - 1) {
    const nextId = MODULE_ORDER[idx + 1]
    if (updated[nextId].status === 'locked') {
      updated[nextId] = { ...updated[nextId], status: 'not-started' }
    }
  }

  return updated
}

export function getOverallProgress(progress) {
  const total    = MODULE_ORDER.length
  const completed = MODULE_ORDER.filter(id => progress[id]?.status === 'completed').length
  const inProgress = MODULE_ORDER.filter(id => progress[id]?.status === 'in-progress').length
  return Math.round(((completed + inProgress * 0.5) / total) * 100)
}

export function isReferenceMode(progress) {
  return MODULE_ORDER.every(id => progress[id]?.status === 'completed')
}
