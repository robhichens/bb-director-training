import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { getUser } from '../../utils/progressTracker'
import Button from '../shared/Button'
import styles from './Auth.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [email, setEmail]   = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    // Check if user exists in localStorage
    const stored = getUser()
    if (stored && stored.email === trimmed) {
      login(stored)
      navigate('/dashboard')
    } else {
      setError("We don't have an account for that email. Please sign up first.")
      setLoading(false)
    }
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
