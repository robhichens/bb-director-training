import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../data/competenciesData'
import { IconPrinter, IconRefresh } from '@tabler/icons-react'
import {
  loadCompetencies,
  markIntroduced,
  markCompleted,
  uncheckIntroduced,
  uncheckCompleted,
  resetAllCompetencies,
  getOverallProgress,
} from '../utils/competencyTracker'
import CategoryAccordion from '../components/competencies/CategoryAccordion'
import styles from './Competencies.module.css'

export default function Competencies() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState(() => loadCompetencies())

  // Find the first incomplete category to open by default
  const defaultOpen = useMemo(() => {
    const first = CATEGORIES.find(cat =>
      cat.items.some(item => !data.items[item.id]?.completed)
    )
    return first ? { [first.id]: true } : {}
  }, []) // eslint-disable-line

  const [openCats, setOpenCats] = useState(defaultOpen)

  function toggleCat(id) {
    setOpenCats(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Handlers
  function handleMarkIntroduced(itemId) {
    setData(d => markIntroduced(d, itemId))
  }
  function handleMarkCompleted(itemId) {
    setData(d => markCompleted(d, itemId))
  }
  function handleUncheckIntroduced(itemId) {
    setData(d => uncheckIntroduced(d, itemId))
  }
  function handleUncheckCompleted(itemId) {
    setData(d => uncheckCompleted(d, itemId))
  }
  function handleResetAll() {
    if (!window.confirm('Reset all competency progress? This cannot be undone.')) return
    setData(resetAllCompetencies())
  }

  const { completed, total, pct } = getOverallProgress(data)

  return (
    <div className={styles.page}>
      {/* Hero */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.heroTop}>
          <div>
            <h1 className={styles.heroTitle}>Competency Tracker</h1>
            <p className={styles.heroSub}>
              {user?.name ? `${user.name} · ` : ''}{user?.location ?? ''} &nbsp;·&nbsp; All topics introduced within 6 weeks
            </p>
          </div>
          <div className={styles.heroActions}>
            <button className={styles.actionBtn} onClick={() => navigate('/competencies/print')} title="Open print view">
              <><IconPrinter size={16} style={{verticalAlign:'middle', marginRight:6}} /> Print View</>
            </button>
            <button className={`${styles.actionBtn} ${styles.actionBtnReset}`} onClick={handleResetAll} title="Reset all progress">
              <><IconRefresh size={16} style={{verticalAlign:'middle', marginRight:6}} /> Reset All</>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className={styles.progressLabel}>{completed} of {total} completed · {pct}%</span>
        </div>
      </motion.div>

      {/* Categories */}
      <div className={styles.categories}>
        {CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.02 }}
          >
            <CategoryAccordion
              category={cat}
              data={data}
              isOpen={!!openCats[cat.id]}
              onToggle={() => toggleCat(cat.id)}
              onMarkIntroduced={handleMarkIntroduced}
              onMarkCompleted={handleMarkCompleted}
              onUncheckIntroduced={handleUncheckIntroduced}
              onUncheckCompleted={handleUncheckCompleted}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
