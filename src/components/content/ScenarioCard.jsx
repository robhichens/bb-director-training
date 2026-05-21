import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { recordScenarioChoice } from '../../lib/analytics'
import Button from '../shared/Button'
import styles from './ScenarioCard.module.css'

export default function ScenarioCard({ title, scenarios, onComplete, completed, moduleId, sectionId }) {
  const { user } = useAuth()
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [chosen, setChosen]           = useState(null)
  const [allDone, setAllDone]         = useState(completed ?? false)

  const scenario = scenarios[scenarioIdx]

  function handleSelect(opt) {
    if (chosen) return
    setChosen(opt)
    recordScenarioChoice({
      user,
      moduleId,
      sectionId,
      activityTitle:  title,
      scenarioIdx,
      situationText:  scenario.situation,
      chosenLabel:    opt.label,
      correct:        opt.correct,
    })
  }

  function handleNext() {
    const nextIdx = scenarioIdx + 1
    if (nextIdx < scenarios.length) {
      setScenarioIdx(nextIdx)
      setChosen(null)
    } else {
      setAllDone(true)
      onComplete?.()
    }
  }

  function handleReset() {
    setScenarioIdx(0)
    setChosen(null)
    setAllDone(false)
  }

  if (allDone && completed) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.doneBanner}>
          <span className={styles.doneIcon}>✓</span>
          <p>Scenarios completed</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Activity identity banner */}
      <div className={styles.activityBanner}>
        <img src="/images/bird-coral.png" alt="" className={styles.activityIcon} aria-hidden="true" />
        <div>
          <p className={styles.activityLabel}>Interactive Activity</p>
          <p className={styles.activitySub}>Read each scenario carefully and choose the best response. Feedback is shown after every choice.</p>
        </div>
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.counter}>
          Scenario {scenarioIdx + 1} of {scenarios.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={scenarioIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <div className={styles.situationBox}>
            <p className={styles.situationLabel}>The Situation</p>
            <p className={styles.situationText}>{scenario.situation}</p>
          </div>

          <p className={styles.question}>{scenario.question}</p>

          <div className={styles.options}>
            {scenario.options.map((opt, i) => {
              const isChosen  = chosen?.label === opt.label
              const isCorrect = opt.correct
              let cls = styles.optBtn
              if (chosen) {
                if (isChosen && opt.correct)   cls += ` ${styles.optCorrect}`
                else if (isChosen && !opt.correct) cls += ` ${styles.optWrong}`
                else                           cls += ` ${styles.optDim}`
              } else {
                cls += ` ${styles.optIdle}`
              }
              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => handleSelect(opt)}
                  disabled={!!chosen}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          <AnimatePresence>
            {chosen && (
              <motion.div
                className={`${styles.feedback} ${chosen.correct ? styles.feedbackCorrect : styles.feedbackWrong}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <span className={styles.feedbackIcon}>{chosen.correct ? '✓' : '✗'}</span>
                <div>
                  <p className={styles.feedbackText}>{chosen.feedback}</p>
                  {chosen.link && (
                    <p className={styles.feedbackLink}>{chosen.link}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {chosen && (
        <div className={styles.footer}>
          {scenarioIdx < scenarios.length - 1 ? (
            <Button variant="primary" pill onClick={handleNext}>
              Next Scenario
            </Button>
          ) : (
            <Button variant="primary" pill onClick={handleNext}>
              Complete Activity
            </Button>
          )}
          <Button variant="secondary" onClick={handleReset}>
            Start Over
          </Button>
        </div>
      )}

      {allDone && !completed && (
        <div className={styles.doneBanner}>
          <span className={styles.doneIcon}>✓</span>
          <p>All scenarios complete! Great work.</p>
        </div>
      )}
    </motion.div>
  )
}
