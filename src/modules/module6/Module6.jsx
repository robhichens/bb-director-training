import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgress } from '../../context/ProgressContext'
import { useAuth } from '../../context/AuthContext'
import { IconCheck, IconArrowRight } from '@tabler/icons-react'
import ReadingSection from '../../components/content/ReadingSection'
import Quiz from '../../components/content/Quiz'
import ScenarioCard from '../../components/content/ScenarioCard'
import ProgressBar from '../../components/shared/ProgressBar'
import content from './content.json'
import styles from './Module6.module.css'

const MODULE_ID = 'module6'

function SectionNav({ sections, currentId, completedIds, onSelect }) {
  return (
    <nav className={styles.sectionNav} aria-label="Module sections">
      {sections.map((sec, idx) => {
        const done    = completedIds.includes(sec.id)
        const current = sec.id === currentId
        const locked  = !done && !current &&
          !completedIds.includes(sections[idx - 1]?.id) && idx > 0
        return (
          <button
            key={sec.id}
            className={`${styles.navItem} ${current ? styles.navCurrent : ''} ${done ? styles.navDone : ''} ${locked ? styles.navLocked : ''}`}
            onClick={() => !locked && onSelect(sec.id)}
            disabled={locked}
            aria-current={current ? 'step' : undefined}
          >
            <span className={styles.navDot}>
              {done ? <IconCheck size={11} /> : idx + 1}
            </span>
            <span className={styles.navLabel}>{sec.title}</span>
            {sec.type === 'quiz' && <span className={styles.navBadge}>Quiz</span>}
            {sec.type === 'scenario' && <span className={styles.navBadge}>Activity</span>}
          </button>
        )
      })}
    </nav>
  )
}

function ModuleComplete({ userName, onGoToRef }) {
  return (
    <motion.div
      className={styles.complete}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <img src="/images/3birds-coral.png" alt="" className={styles.completeImg} aria-hidden="true" />
      <h2 className={styles.completeTitle}>Module 6 Complete!</h2>
      <p className={styles.completeSub}>
        Excellent work, {userName}. You've completed all six core training modules. One final step: the Director Reference Library.
      </p>

      <div className={styles.nextModuleCard}>
        <div className={styles.nextModuleText}>
          <p className={styles.nextModuleLabel}>Up Next</p>
          <p className={styles.nextModuleTitle}>Module 7 — Director Reference Library</p>
          <p className={styles.nextModuleSub}>
            Your permanent quick-access reference: contacts, ProCare paths, billing codes, checklists, and key links. Takes about 20 minutes — and stays useful forever.
          </p>
        </div>
        <button className={styles.nextModuleBtn} onClick={onGoToRef}>
          Go to Module 7 <IconArrowRight size={16} style={{verticalAlign:'middle', marginLeft:4}} />
        </button>
      </div>
    </motion.div>
  )
}

export default function Module6() {
  const { progress, completeSection, recordQuizScore, completeModule, isSectionComplete } = useProgress()
  const { user } = useAuth()
  const navigate = useNavigate()

  const modProgress  = progress[MODULE_ID]
  const completedIds = modProgress?.sectionsCompleted ?? []

  const firstIncomplete = content.sections.find(s => !completedIds.includes(s.id))
  const [currentId, setCurrentId] = useState(firstIncomplete?.id ?? content.sections[0].id)

  const isModuleComplete = modProgress?.status === 'completed'
  const currentSection   = content.sections.find(s => s.id === currentId)

  function goToNext() {
    const idx  = content.sections.findIndex(s => s.id === currentId)
    const next = content.sections[idx + 1]
    if (next) {
      setCurrentId(next.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      completeModule(MODULE_ID)
    }
  }

  function handleReadingComplete() {
    completeSection(MODULE_ID, currentId)
    goToNext()
  }

  function handleQuizComplete(score, passed) {
    recordQuizScore(MODULE_ID, currentId, score, passed)
    if (passed) {
      completeSection(MODULE_ID, currentId)
      setTimeout(goToNext, 1800)
    }
  }

  function handleScenarioComplete() {
    completeSection(MODULE_ID, currentId)
    goToNext()
  }

  const sectionPct = Math.round((completedIds.length / content.sections.length) * 100)
  const firstName  = user?.name?.split(' ')[0] ?? 'Director'

  if (isModuleComplete) {
    return <div><ModuleComplete userName={firstName} onGoToRef={() => navigate('/module/7')} /></div>
  }

  return (
    <div>
      <div className={styles.moduleHeader}>
        <div className={styles.moduleHeaderTop}>
          <div>
            <p className={styles.moduleLabel}>Module 6</p>
            <h1 className={styles.moduleTitle}>{content.title}</h1>
            <p className={styles.moduleMeta}>
              {content.estimatedTime} &nbsp;·&nbsp; {content.sections.length} sections
            </p>
          </div>
          <div className={styles.moduleProgress}>
            <ProgressBar progress={sectionPct} showLabel />
          </div>
        </div>

        <SectionNav
          sections={content.sections}
          currentId={currentId}
          completedIds={completedIds}
          onSelect={setCurrentId}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {currentSection?.type === 'reading' && (
            <ReadingSection
              title={currentSection.title}
              content={currentSection.content}
              learningObjectives={currentSection.learningObjectives}
              onComplete={handleReadingComplete}
              completed={isSectionComplete(MODULE_ID, currentId)}
            />
          )}
          {currentSection?.type === 'quiz' && (
            <Quiz
              title={currentSection.title}
              questions={currentSection.questions}
              onComplete={handleQuizComplete}
              completed={isSectionComplete(MODULE_ID, currentId)}
              previousScore={modProgress?.quizScores?.[currentId]?.score}
              moduleId={MODULE_ID}
              sectionId={currentId}
            />
          )}
          {currentSection?.type === 'scenario' && (
            <ScenarioCard
              title={currentSection.title}
              scenarios={currentSection.scenarios}
              onComplete={handleScenarioComplete}
              completed={isSectionComplete(MODULE_ID, currentId)}
              moduleId={MODULE_ID}
              sectionId={currentId}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
