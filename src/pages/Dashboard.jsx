import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../context/ProgressContext'
import Button from '../components/shared/Button'
import ProgressBar from '../components/shared/ProgressBar'
import styles from './Dashboard.module.css'

const MODULES = [
  { id: 'module1', num: 1, title: 'Foundation & Culture',   time: '45–60 min', desc: 'Core principles, staff framework, KPIs, and admin standards.' },
  { id: 'module2', num: 2, title: 'Daily Operations',        time: '60–90 min', desc: 'The full operational timeline from 7:30 AM through close.' },
  { id: 'module3', num: 3, title: 'People Management',       time: '90–120 min', desc: 'Hiring, scheduling, performance management, and retention.' },
  { id: 'module4', num: 4, title: 'Business Operations',     time: '90–120 min', desc: 'Monthly duties, enrollment, billing, and CRM workflows.' },
  { id: 'module5', num: 5, title: 'Compliance & Safety',     time: '60–90 min', desc: 'Virginia licensing, health protocols, and incident reporting.' },
  { id: 'module6', num: 6, title: 'Communication & Community', time: '50–65 min', desc: 'Parent relationships, marketing, difficult conversations, and community presence.' },
  { id: 'module7', num: 7, title: 'Director Reference Library', time: '20–30 min', desc: 'Quick-access contacts, ProCare paths, billing codes, checklists, and key links.' },
]

function ModuleCard({ mod, status, onStart }) {
  const locked    = status === 'locked'
  const completed = status === 'completed'
  const active    = status === 'in-progress'

  return (
    <motion.div
      className={`${styles.moduleCard} ${locked ? styles.locked : ''} ${completed ? styles.done : ''}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.cardTop}>
        <span className={styles.modNum}>Module {mod.num}</span>
        <span className={`${styles.badge} ${styles[status]}`}>
          {completed ? '✓ Complete' : active ? 'In Progress' : locked ? '🔒 Locked' : 'Not Started'}
        </span>
      </div>
      <h3 className={styles.cardTitle}>{mod.title}</h3>
      <p className={styles.cardDesc}>{mod.desc}</p>
      <div className={styles.cardFooter}>
        <span className={styles.cardTime}>{mod.time}</span>
        {!locked && (
          <Button
            variant={completed ? 'secondary' : 'primary'}
            pill
            onClick={() => onStart(mod.num)}
          >
            {completed ? 'Review' : active ? 'Continue' : 'Begin'}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user }          = useAuth()
  const { progress, overallPct } = useProgress()
  const navigate          = useNavigate()

  const firstName = user?.name?.split(' ')[0] ?? 'Director'
  const inProgress = MODULES.find(m => progress[m.id]?.status === 'in-progress')
  const nextUp     = MODULES.find(m => progress[m.id]?.status === 'not-started')
  const resumeTarget = inProgress ?? nextUp

  return (
    <div>
      {/* Welcome banner */}
      <motion.div
        className={styles.welcome}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className={styles.welcomeText}>
          <h1 className={styles.welcomeTitle}>Welcome back, {firstName}!</h1>
          <p className={styles.welcomeSub}>
            {user?.location} · {overallPct === 0
              ? "Let's get your training started."
              : overallPct === 100
              ? 'All modules complete — reference mode active.'
              : `You're ${overallPct}% through your training.`}
          </p>
        </div>
        <div className={styles.welcomeProgress}>
          <ProgressBar progress={overallPct} showLabel height={10} />
        </div>
      </motion.div>

      {/* Resume CTA */}
      {resumeTarget && overallPct < 100 && (
        <div className={styles.resumeBar}>
          <div>
            <p className={styles.resumeLabel}>
              {inProgress ? 'Continue where you left off' : 'Up next'}
            </p>
            <p className={styles.resumeTitle}>Module {resumeTarget.num}: {resumeTarget.title}</p>
          </div>
          <Button variant="primary" pill onClick={() => navigate(`/module/${resumeTarget.num}`)}>
            {inProgress ? 'Resume →' : 'Start →'}
          </Button>
        </div>
      )}

      {/* Module grid */}
      <div className={styles.grid}>
        {MODULES.map(mod => (
          <ModuleCard
            key={mod.id}
            mod={mod}
            status={progress[mod.id]?.status ?? 'locked'}
            onStart={(num) => navigate(`/module/${num}`)}
          />
        ))}
      </div>
    </div>
  )
}
