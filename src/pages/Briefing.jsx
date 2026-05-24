import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useBirdie } from '../context/BirdieContext'
import { getRightNowTips, getTodayTips, getAllMonthTips } from '../lib/tipEngine'
import {
  isChecked, checkTask, uncheckTask,
  getAllChecked, formatCheckedAt, formatCheckedAtFull,
} from '../lib/taskStore'
import { IconX, IconCheck, IconArrowRight, IconClock, IconNotes, IconCalendar, IconAlertTriangle } from '@tabler/icons-react'
import styles from './Briefing.module.css'

const DAY_NAMES   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December']

function greeting(hour) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// ── TipModal ─────────────────────────────────────────────────────────────
function TipModal({ tip, scope, checked, checkedAt, onCheck, onAskBirdie, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className={styles.modalOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className={styles.modalHeader}>
            <div className={styles.modalMeta}>
              <span className={`${styles.urgencyDot} ${styles[tip.urgency]}`} />
              <span className={styles.modalCategory}>{tip.category}</span>
            </div>
            <button className={styles.modalClose} onClick={onClose} aria-label="Close"><IconX size={18} /></button>
          </div>

          {/* Title + body */}
          <h2 className={styles.modalTitle}>{tip.title}</h2>
          <p className={styles.modalBody}>{tip.body}</p>

          {/* Task tracker */}
          {tip.trackable && (
            <div className={`${styles.taskRow} ${checked ? styles.taskDone : ''}`}>
              <label className={styles.taskLabel}>
                <input
                  type="checkbox"
                  className={styles.taskCheck}
                  checked={checked}
                  onChange={() => {
                    onCheck(tip.id, scope, checked)
                    if (!checked) setTimeout(onClose, 280)
                  }}
                />
                <span className={styles.taskText}>
                  {checked
                    ? `Completed at ${scope === 'daily' ? formatCheckedAt(checkedAt) : formatCheckedAtFull(checkedAt)}`
                    : 'Mark as completed'}
                </span>
              </label>
            </div>
          )}

          {/* Ask Birdie */}
          <button
            className={styles.modalBirdieBtn}
            onClick={() => { onAskBirdie(tip.birdiePrompt); onClose() }}
          >
            <img src="/images/bird-coral.png" alt="" className={styles.modalBirdieIcon} />
            Ask Birdie
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── TipTile ───────────────────────────────────────────────────────────────
function TipTile({ tip, scope, checked, onOpen }) {
  return (
    <motion.button
      className={`${styles.tile} ${styles[tip.urgency]} ${checked ? styles.tileDone : ''}`}
      onClick={() => onOpen(tip, scope)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      aria-label={tip.title}
    >
      <div className={styles.tileAccent} />
      {checked && <IconCheck size={44} className={styles.tileTick} />}
      <p className={styles.tileTitle}>{tip.title}</p>
      <span className={styles.tileCat}>{tip.category}</span>
    </motion.button>
  )
}

// ── NotCompletedBar ───────────────────────────────────────────────────────
function NotCompletedBar({ tip, scope, onOpen }) {
  return (
    <motion.button
      className={styles.ncBar}
      onClick={() => onOpen(tip, scope)}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18 }}
    >
      <span className={`${styles.ncDot} ${styles[tip.urgency]}`} />
      <span className={styles.ncTitle}>{tip.title}</span>
      <span className={styles.ncCat}>{tip.category}</span>
      <IconArrowRight size={16} className={styles.ncArrow} />
    </motion.button>
  )
}

// ── SectionHeading ────────────────────────────────────────────────────────
function SectionHeading({ icon: Icon, label, count, doneCount }) {
  const allDone = count > 0 && doneCount === count
  return (
    <div className={styles.sectionHead}>
      <Icon size={18} className={styles.sectionEmoji} />
      <h2 className={styles.sectionLabel}>{label}</h2>
      {count > 0 && (
        <span className={`${styles.sectionCount} ${allDone ? styles.sectionCountDone : ''}`}>
          {allDone ? 'Done!' : `${doneCount}/${count}`}
        </span>
      )}
    </div>
  )
}

// ── TileGrid ──────────────────────────────────────────────────────────────
function TileGrid({ tips, scope, checked, onOpen }) {
  if (tips.length === 0) return null
  return (
    <div className={styles.tileGrid}>
      {tips.map(tip => (
        <TipTile
          key={tip.id}
          tip={tip}
          scope={scope}
          checked={!!checked[tip.id]?.checked}
          onOpen={onOpen}
        />
      ))}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function Briefing() {
  const { user }           = useAuth()
  const { openWithPrompt } = useBirdie()

  const now       = useMemo(() => new Date(), [])
  const hour      = now.getHours()
  const dayName   = DAY_NAMES[now.getDay()]
  const monthName = MONTH_NAMES[now.getMonth()]
  const dateNum   = now.getDate()

  const firstName = user?.name?.split(' ')[0] ?? 'Director'

  // Tips
  const rightNowTips = useMemo(() => getRightNowTips(now), [now])
  const todayTips    = useMemo(() => getTodayTips(now), [now])
  const monthTips    = useMemo(() => getAllMonthTips(), [])

  // Task state — refreshed on every toggle
  const [tick, setTick] = useState(0)  // increment to force re-read
  const dailyChecked  = useMemo(() => getAllChecked('daily'),   [tick])   // eslint-disable-line
  const monthlyChecked = useMemo(() => getAllChecked('monthly'), [tick])  // eslint-disable-line

  // Modal
  const [modalTip, setModalTip]     = useState(null)
  const [modalScope, setModalScope] = useState(null)

  const openModal = useCallback((tip, scope) => {
    setModalTip(tip)
    setModalScope(scope)
  }, [])

  const closeModal = useCallback(() => {
    setModalTip(null)
    setModalScope(null)
  }, [])

  function handleCheck(tipId, scope, currentlyChecked) {
    if (currentlyChecked) uncheckTask(tipId, scope)
    else checkTask(tipId, scope)
    setTick(t => t + 1)
  }

  function handleAskBirdie(prompt) {
    openWithPrompt(prompt)
  }

  // Not Completed: trackable tips that aren't checked
  const ncToday = todayTips.filter(t => t.trackable && !dailyChecked[t.id]?.checked)
  const ncMonth = monthTips.filter(t => !monthlyChecked[t.id]?.checked)
  const hasNC   = ncToday.length > 0 || ncMonth.length > 0

  // Counts for section headers
  const todayDone  = todayTips.filter(t => t.trackable && !!dailyChecked[t.id]?.checked).length
  const todayTotal = todayTips.filter(t => t.trackable).length
  const monthDone  = monthTips.filter(t => !!monthlyChecked[t.id]?.checked).length

  const totalTrackable = todayTotal + monthTips.length
  const totalDone      = todayDone + monthDone

  return (
    <div className={styles.page}>
      {/* Hero */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>{greeting(hour)}, {firstName}</h1>
          <p className={styles.heroSub}>
            {dayName}, {monthName} {dateNum}
            {totalTrackable > 0 && (
              <> &nbsp;·&nbsp; {totalDone} of {totalTrackable} tasks done</>
            )}
          </p>
        </div>
        <img src="/images/bird-coral.png" alt="" className={styles.heroBird}
          style={{ filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
      </motion.div>

      {/* ── RIGHT NOW ───────────────────────────────── */}
      {rightNowTips.length > 0 && (
        <section className={styles.section}>
          <SectionHeading icon={IconClock} label="Right Now" count={0} doneCount={0} />
          <TileGrid tips={rightNowTips} scope="daily" checked={{}} onOpen={openModal} />
        </section>
      )}

      {/* ── TODAY ───────────────────────────────────── */}
      {todayTips.length > 0 && (
        <section className={styles.section}>
          <SectionHeading
            icon={IconNotes}
            label={`Today — ${dayName}`}
            count={todayTotal}
            doneCount={todayDone}
          />
          <TileGrid tips={todayTips} scope="daily" checked={dailyChecked} onOpen={openModal} />
        </section>
      )}

      {/* ── MONTH FOCUS ─────────────────────────────── */}
      <section className={styles.section}>
        <SectionHeading
          icon={IconCalendar}
          label={`${monthName} Tasks`}
          count={monthTips.length}
          doneCount={monthDone}
        />
        <TileGrid tips={monthTips} scope="monthly" checked={monthlyChecked} onOpen={openModal} />
      </section>

      {/* ── NOT COMPLETED ───────────────────────────── */}
      {hasNC && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <IconAlertTriangle size={18} className={styles.sectionEmoji} />
            <h2 className={`${styles.sectionLabel} ${styles.ncLabel}`}>Not Completed</h2>
          </div>

          {ncToday.length > 0 && (
            <div className={styles.ncGroup}>
              <p className={styles.ncSubhead}>Today</p>
              <div className={styles.ncGrid}>
                {ncToday.map(tip => (
                  <NotCompletedBar key={tip.id} tip={tip} scope="daily" onOpen={openModal} />
                ))}
              </div>
            </div>
          )}

          {ncMonth.length > 0 && (
            <div className={styles.ncGroup}>
              <p className={styles.ncSubhead}>This Month</p>
              <div className={styles.ncGrid}>
                {ncMonth.map(tip => (
                  <NotCompletedBar key={tip.id} tip={tip} scope="monthly" onOpen={openModal} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Modal */}
      {modalTip && (
        <TipModal
          tip={modalTip}
          scope={modalScope}
          checked={modalScope === 'daily'
            ? !!dailyChecked[modalTip.id]?.checked
            : !!monthlyChecked[modalTip.id]?.checked}
          checkedAt={modalScope === 'daily'
            ? dailyChecked[modalTip.id]?.checkedAt
            : monthlyChecked[modalTip.id]?.checkedAt}
          onCheck={handleCheck}
          onAskBirdie={handleAskBirdie}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
