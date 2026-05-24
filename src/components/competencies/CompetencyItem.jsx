import { useState } from 'react'
import { fmtDate } from '../../utils/competencyTracker'
import { IconInfoCircle } from '@tabler/icons-react'
import styles from './CompetencyItem.module.css'

export default function CompetencyItem({ item, itemData, onMarkIntroduced, onMarkCompleted, onUncheckIntroduced, onUncheckCompleted }) {
  const [detailOpen, setDetailOpen] = useState(false)

  const { introduced, introducedDate, completed, completedDate } = itemData

  function handleIntroducedClick() {
    if (introduced) {
      if (completed) {
        if (!window.confirm('Uncheck "Introduced"? This will also remove the Completed status.')) return
      }
      onUncheckIntroduced(item.id)
    } else {
      onMarkIntroduced(item.id)
    }
  }

  function handleCompletedClick() {
    if (completed) {
      onUncheckCompleted(item.id)
    } else if (introduced) {
      onMarkCompleted(item.id)
    }
  }

  const isFullyDone = introduced && completed

  return (
    <div className={`${styles.item} ${isFullyDone ? styles.itemDone : ''}`}>
      {/* Label row */}
      <div className={styles.labelRow}>
        <span className={`${styles.label} ${isFullyDone ? styles.labelDone : ''}`}>{item.label}</span>
        {item.detail && (
          <button
            className={`${styles.infoBtn} ${detailOpen ? styles.infoBtnOpen : ''}`}
            onClick={() => setDetailOpen(o => !o)}
            aria-label={detailOpen ? 'Hide detail' : 'Show detail'}
            title={detailOpen ? 'Hide detail' : 'Show detail'}
          >
            <IconInfoCircle size={14} />
          </button>
        )}
      </div>

      {/* Detail panel */}
      {item.detail && detailOpen && (
        <p className={styles.detail}>{item.detail}</p>
      )}

      {/* Status + action row */}
      <div className={styles.statusRow}>
        {/* Introduced indicator */}
        <button
          className={`${styles.statusBtn} ${introduced ? styles.statusDone : styles.statusPending}`}
          onClick={handleIntroducedClick}
          title={introduced ? `Introduced ${fmtDate(introducedDate)} — click to undo` : 'Mark as introduced'}
        >
          <span className={`${styles.dot} ${introduced ? styles.dotDone : styles.dotPending}`} />
          <span className={styles.statusLabel}>
            {introduced ? `Introduced ${fmtDate(introducedDate)}` : 'Introduced'}
          </span>
        </button>

        {/* Completed indicator */}
        <button
          className={`${styles.statusBtn} ${completed ? styles.statusDone : introduced ? styles.statusAvailable : styles.statusLocked}`}
          onClick={handleCompletedClick}
          disabled={!introduced && !completed}
          title={completed ? `Completed ${fmtDate(completedDate)} — click to undo` : introduced ? 'Mark as completed' : 'Must be introduced first'}
        >
          <span className={`${styles.dot} ${completed ? styles.dotDone : styles.dotPending}`} />
          <span className={styles.statusLabel}>
            {completed ? `Completed ${fmtDate(completedDate)}` : 'Completed'}
          </span>
        </button>

        {/* Action button */}
        <div className={styles.action}>
          {!introduced && (
            <button className={styles.actionBtn} onClick={() => onMarkIntroduced(item.id)}>
              Mark Introduced
            </button>
          )}
          {introduced && !completed && (
            <button className={`${styles.actionBtn} ${styles.actionBtnComplete}`} onClick={() => onMarkCompleted(item.id)}>
              Mark Completed
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
