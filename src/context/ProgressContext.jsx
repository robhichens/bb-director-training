import { createContext, useContext, useState, useCallback } from 'react'
import {
  getProgress,
  saveProgress,
  markSectionComplete,
  saveQuizScore,
  markModuleComplete,
  getOverallProgress,
  isReferenceMode,
  getUser,
} from '../utils/progressTracker'
import { syncProgressToFirestore } from '../lib/syncProgress'
import { syncCompleted, isAllModulesComplete } from '../lib/platformSync'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => getProgress())

  const persist = useCallback((next) => {
    saveProgress(next)
    setProgress(next)
    // Fire-and-forget sync to Firestore so the admin page has live data
    const user = getUser()
    syncProgressToFirestore(user, next)
  }, [])

  const completeSection = useCallback((moduleId, sectionId) => {
    setProgress(prev => {
      const next = markSectionComplete(prev, moduleId, sectionId)
      saveProgress(next)
      syncProgressToFirestore(getUser(), next)
      return next
    })
  }, [])

  const recordQuizScore = useCallback((moduleId, quizId, score, passed) => {
    setProgress(prev => {
      const next = saveQuizScore(prev, moduleId, quizId, score, passed)
      saveProgress(next)
      syncProgressToFirestore(getUser(), next)
      return next
    })
  }, [])

  const completeModule = useCallback((moduleId) => {
    setProgress(prev => {
      const next = markModuleComplete(prev, moduleId)
      saveProgress(next)
      syncProgressToFirestore(getUser(), next)
      // Platform mode: notify bb-platform when all 7 modules are complete
      if (isAllModulesComplete(next)) syncCompleted()
      return next
    })
  }, [])

  const resetProgress = useCallback(() => {
    const fresh = getProgress()
    persist(fresh)
  }, [persist])

  const isSectionComplete = useCallback((moduleId, sectionId) =>
    progress[moduleId]?.sectionsCompleted?.includes(sectionId) ?? false,
  [progress])

  const isModuleLocked = useCallback((moduleId) =>
    progress[moduleId]?.status === 'locked',
  [progress])

  const overallPct = getOverallProgress(progress)
  const refMode    = isReferenceMode(progress)

  return (
    <ProgressContext.Provider value={{
      progress,
      completeSection,
      recordQuizScore,
      completeModule,
      resetProgress,
      isSectionComplete,
      isModuleLocked,
      overallPct,
      refMode,
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider')
  return ctx
}
