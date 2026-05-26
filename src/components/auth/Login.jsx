import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import { getUser, saveProgress } from '../../utils/progressTracker'
import { makeDocId } from '../../lib/syncProgress'
import Button from '../shared/Button'
import styles from './Auth.module.css'

const MODULE_ORDER = ['module1', 'module2', 'module3', 'module4', 'module5', 'module6', 'module7']

// Rebuild a valid progress object from Firestore module data
function progressFromFirestore(firestoreModules) {
  // Start with a clean default (all locked except module1)
  const progress = MODULE_ORDER.reduce((acc, id, idx) => {
    acc[id] = { status: idx === 0 ? 'not-started' : 'locked', sectionsCompleted: [], currentSection: null, quizScores: {}, completedAt: null }
    return acc
  }, {})

  // Overlay statuses & completedAt from Firestore
  Object.entries(firestoreModules || {}).forEach(([id, mod]) => {
    if (progress[id]) {
      progress[id].status      = mod.status      || progress[id].status
      progress[id].completedAt = mod.completedAt || null
    }
  })

  // Re-run the unlock migration so completed modules open the next one
  MODULE_ORDER.forEach((id, idx) => {
    if (progress[id]?.status === 'completed' && idx < MODULE_ORDER.length - 1) {
      const next = MODULE_ORDER[idx + 1]
      if (progress[next]?.status === 'locked') progress[next].status = 'not-started'
    }
  })

  return progress
}

export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [email, setEmail]   = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)

    // 1️⃣ Fast path — account already in localStorage (same browser/device)
    const stored = getUser()
    if (stored && stored.email === trimmed) {
      login(stored)
      navigate('/dashboard')
      return
    }

    // 2️⃣ Fallback — look up the email in Firestore and restore the session
    try {
      const snap = await getDoc(doc(db, 'userProgress', makeDocId(trimmed)))
      if (snap.exists()) {
        const data = snap.data()
        const user = {
          email:     trimmed,
          name:      data.name      || '',
          location:  data.location  || '',
          createdAt: data.createdAt || new Date().toISOString(),
        }
        // Restore module completion state from Firestore
        saveProgress(progressFromFirestore(data.modules))
        login(user)     // also persists user to localStorage
        navigate('/dashboard')
        return
      }
    } catch {
      // Firestore unavailable — fall through to error message
    }

    setError("We don't have an account for that email. Please sign up first.")
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgAccent} />
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className={styles.logoWrap}>
          <img src="/images/bb-logo-full-color.png" alt="Bright Beginnings" className={styles.logo} />
        </div>

        <h1 className={styles.title}>Director Training</h1>
        <p className={styles.subtitle}>Sign in to continue your training</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.input}
              placeholder="you@brightbeginningsva.com"
              autoComplete="email"
              autoFocus
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" pill disabled={loading} className={styles.submitBtn}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className={styles.switchLink}>
          New here? <Link to="/signup">Create your account</Link>
        </p>
      </motion.div>

      <div className={styles.birds}>
        <img src="/images/3birds-coral.png" alt="" aria-hidden="true" />
      </div>
    </div>
  )
}
