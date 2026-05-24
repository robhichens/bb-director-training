import { useNavigate, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgress } from '../../context/ProgressContext'
import { getQuickPct } from '../../utils/competencyTracker'
import { IconCheck, IconArrowRight, IconLock, IconX, IconNotes, IconListCheck } from '@tabler/icons-react'
import styles from './Sidebar.module.css'

const MODULES = [
  { id: 'module1', num: 1, title: 'Foundation & Culture',      time: '45–60 min' },
  { id: 'module2', num: 2, title: 'Daily Operations',          time: '60–90 min' },
  { id: 'module3', num: 3, title: 'People Management',         time: '90–120 min' },
  { id: 'module4', num: 4, title: 'Business Operations',       time: '90–120 min' },
  { id: 'module5', num: 5, title: 'Compliance & Safety',       time: '60–90 min' },
  { id: 'module6', num: 6, title: 'Communication & Community', time: '50–65 min' },
  { id: 'module7', num: 7, title: 'Director Reference Library', time: '20–30 min' },
]

function StatusIcon({ status }) {
  if (status === 'completed')   return <IconCheck className={`${styles.icon} ${styles.done}`} size={14} />
  if (status === 'in-progress') return <IconArrowRight className={`${styles.icon} ${styles.active}`} size={14} />
  return <IconLock className={`${styles.icon} ${styles.locked}`} size={13} />
}

export default function Sidebar({ open, onClose }) {
  const { progress } = useProgress()
  const navigate     = useNavigate()
  const location     = useLocation()

  function handleModuleClick(mod) {
    const status = progress[mod.id]?.status
    if (status === 'locked') return
    navigate(`/module/${mod.num}`)
    onClose?.()
  }

  function handleNavClick(path) {
    navigate(path)
    onClose?.()
  }

  const onBriefing     = location.pathname === '/briefing'
  const onCompetencies = location.pathname.startsWith('/competencies')
  const competencyPct  = useMemo(() => getQuickPct(), [])

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <nav className={`${styles.sidebar} ${open ? styles.open : ''}`} aria-label="Training modules">
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarTitle}>Navigation</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu"><IconX size={16} /></button>
        </div>

        {/* Quick links */}
        <div className={styles.quickLinks}>
          <button
            className={`${styles.quickBtn} ${onBriefing ? styles.quickActive : ''}`}
            onClick={() => handleNavClick('/briefing')}
          >
            <IconNotes size={18} className={styles.quickIcon} />
            <span className={styles.quickLabel}>Daily Brief</span>
          </button>
          <button
            className={`${styles.quickBtn} ${onCompetencies ? styles.quickActive : ''}`}
            onClick={() => handleNavClick('/competencies')}
          >
            <IconListCheck size={18} className={styles.quickIcon} />
            <span className={styles.quickLabel}>Competency Tracker</span>
            {competencyPct > 0 && (
              <span className={styles.quickBadge}>{competencyPct}%</span>
            )}
          </button>
        </div>

        <p className={styles.sectionDivider}>Training Modules</p>

        <ul className={styles.list}>
          {MODULES.map(mod => {
            const status = progress[mod.id]?.status ?? 'locked'
            const locked = status === 'locked'
            return (
              <li key={mod.id}>
                <button
                  className={`${styles.moduleBtn} ${styles[status]} ${locked ? styles.isLocked : ''}`}
                  onClick={() => handleModuleClick(mod)}
                  disabled={locked}
                  aria-disabled={locked}
                >
                  <div className={styles.moduleMeta}>
                    <span className={styles.moduleNum}>Module {mod.num}</span>
                    <StatusIcon status={status} />
                  </div>
                  <span className={styles.moduleTitle}>{mod.title}</span>
                  <span className={styles.moduleTime}>{mod.time}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className={styles.sidebarFooter}>
          <img src="/images/tree-full-color.png" alt="" aria-hidden="true" className={styles.tree} />
        </div>
      </nav>
    </>
  )
}
