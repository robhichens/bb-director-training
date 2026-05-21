import { createContext, useContext, useState, useCallback } from 'react'
import {
  getProgress,
  saveProgress,
  markSectionComplete,
  saveQuizScore,
  markModuleComplete,
  getOverallProgress,
  isReferenceMode,
} from '../utils/progressTracker'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => getProgress())

  const persist = useCallback((next) => {
    saveProgress(next)
    setProgress(next)
  }, [])

  const completeSection = useCallback((moduleId, sectionId) => {
    setProgress(prev => {
      const next = markSectionComplete(prev, moduleId, sectionId)
      saveProgress(next)
      return next
    })
  }, [])

  const recordQuizScore = useCallback((moduleId, quizId, score, passed) => {
    setProgress(prev => {
      const next = saveQuizScore(prev, moduleId, quizId, score, passed)
      saveProgress(next)
      return next
    })
  }, [])

  const completeModule = useCallback((moduleId) => {
    setProgress(prev => {
      const next = markModuleComplete(prev, moduleId)
      saveProgress(next)
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
