import { motion } from 'framer-motion'
import styles from './ProgressBar.module.css'

export default function ProgressBar({ progress = 0, showLabel = false, height = 8 }) {
  const pct = Math.min(100, Math.max(0, progress))
  return (
    <div className={styles.wrapper} aria-label={`${pct}% complete`} role="progressbar"
         aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className={styles.track} style={{ height }}>
        <motion.div
          className={styles.fill}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ height }}
        />
      </div>
      {showLabel && (
        <span className={styles.label}>{pct}% complete</span>
      )}
    </div>
  )
}
