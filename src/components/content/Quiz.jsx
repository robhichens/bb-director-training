import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { recordQuizAttempt } from '../../lib/analytics'
import Button from '../shared/Button'
import styles from './Quiz.module.css'

const PASS_THRESHOLD = 1.0

export default function Quiz({ title, questions, onComplete, completed, previousScore, moduleId, sectionId }) {
  const { user } = useAuth()
  const [answers, setAnswers]     = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults]     = useState(null)

  function selectAnswer(qId, answer) {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qId]: answer }))
  }

  function handleSubmit() {
    const scored = questions.map(q => {
      const given   = answers[q.id]
      const correct = String(q.correctAnswer) === String(given)
      return { ...q, given, correct }
    })
    const numCorrect = scored.filter(r => r.correct).length
    const score      = Math.round((numCorrect / questions.length) * 100)
    const passed     = score >= PASS_THRESHOLD * 100
    setResults({ scored, score, passed, numCorrect })
    setSubmitted(true)
    onComplete?.(score, passed)
    recordQuizAttempt({ user, moduleId, sectionId, quizTitle: title, results: scored, score, passed, numCorrect })
  }

  function handleRetake() {
    setAnswers({})
    setSubmitted(false)
    setResults(null)
  }

  const allAnswered = questions.every(q => answers[q.id] !== undefined)

  if (completed && !submitted) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.passedBanner}>
          <span className={styles.passedIcon}>✓</span>
          <div>
            <p className={styles.passedTitle}>Quiz Passed</p>
            <p className={styles.passedSub}>You scored {previousScore}% — review the answers below.</p>
          </div>
        </div>

        <div className={styles.questions}>
          {questions.map((q, idx) => {
            const options = q.type === 'true-false' ? ['True', 'False'] : q.options
            return (
              <div key={q.id} className={styles.question}>
                <p className={styles.qText}>
                  <span className={styles.qNum}>{idx + 1}.</span> {q.question}
                </p>
                <div className={styles.options}>
                  {options.map(opt => {
                    const strOpt    = String(opt)
                    const isCorrect = strOpt === String(q.correctAnswer)
                    const optClass  = `${styles.option} ${isCorrect ? styles.optCorrect : styles.optNeutral}`
                    return (
                      <button key={strOpt} className={optClass} disabled>
                        {q.type === 'true-false'
                          ? opt
                          : <><span className={styles.optBullet} />{opt}</>}
                      </button>
                    )
                  })}
                </div>
                <div className={`${styles.explanation} ${styles.explCorrect}`}>
                  <span className={styles.explIcon}>✓</span>
                  <span>{q.explanation}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className={styles.footer}>
          <Button variant="primary" pill onClick={() => onComplete?.(previousScore, true)}>
            Next →
          </Button>
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
      <div className={styles.quizHeader}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.meta}>{questions.length} questions · 100% to pass</p>
      </div>

      {results && (
        <div className={`${styles.resultBanner} ${results.passed ? styles.resultPass : styles.resultFail}`}>
          {results.passed ? (
            <>
              <span className={styles.resultIcon}>✓</span>
              <div>
                <p className={styles.resultTitle}>Excellent! You passed.</p>
                <p className={styles.resultSub}>{results.score}% — {results.numCorrect} of {questions.length} correct</p>
              </div>
            </>
          ) : (
            <>
              <span className={styles.resultIcon}>✗</span>
              <div>
                <p className={styles.resultTitle}>Not quite — give it another try.</p>
                <p className={styles.resultSub}>{results.numCorrect} of {questions.length} correct — need 100% to pass. Review the explanations below.</p>
              </div>
            </>
          )}
        </div>
      )}

      <div className={styles.questions}>
        {questions.map((q, idx) => {
          const result  = results?.scored.find(r => r.id === q.id)
          const given   = answers[q.id]
          const options = q.type === 'true-false'
            ? ['True', 'False']
            : q.options

          return (
            <div key={q.id} className={styles.question}>
              <p className={styles.qText}>
                <span className={styles.qNum}>{idx + 1}.</span> {q.question}
              </p>
              <div className={styles.options}>
                {options.map(opt => {
                  const strOpt     = String(opt)
                  const strCorrect = String(q.correctAnswer)
                  const isSelected = String(given) === strOpt
                  const isCorrect  = strOpt === strCorrect
                  let optClass = styles.option
                  if (submitted) {
                    if (isCorrect)               optClass += ` ${styles.optCorrect}`
                    else if (isSelected)         optClass += ` ${styles.optWrong}`
                    else                         optClass += ` ${styles.optNeutral}`
                  } else if (isSelected) {
                    optClass += ` ${styles.optSelected}`
                  }
                  return (
                    <button
                      key={strOpt}
                      className={optClass}
                      onClick={() => selectAnswer(q.id, strOpt)}
                      disabled={submitted}
                    >
                      {q.type === 'true-false'
                        ? opt
                        : <><span className={styles.optBullet} />{opt}</>}
                    </button>
                  )
                })}
              </div>

              <AnimatePresence>
                {submitted && result && (
                  <motion.div
                    className={`${styles.explanation} ${result.correct ? styles.explCorrect : styles.explWrong}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className={styles.explIcon}>{result.correct ? '✓' : '✗'}</span>
                    <span>{q.explanation}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className={styles.footer}>
        {!submitted ? (
          <Button
            variant="primary"
            pill
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Submit Quiz
          </Button>
        ) : results && !results.passed ? (
          <Button variant="ghost" pill onClick={handleRetake}>
            Retake Quiz
          </Button>
        ) : null}
        {!submitted && !allAnswered && (
          <p className={styles.hint}>Answer all questions to submit.</p>
        )}
      </div>
    </motion.div>
  )
}
