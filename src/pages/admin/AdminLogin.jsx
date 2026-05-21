import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { checkAdminCredentials, setAdminSession } from './adminAuth'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (checkAdminCredentials(form.username.trim(), form.password)) {
      setAdminSession()
      navigate('/admin')
    } else {
      setError('Invalid username or password.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className={styles.logoWrap}>
          <img src="/images/bb-logo-full-color.png" alt="Bright Beginnings" className={styles.logo} />
        </div>

        <h1 className={styles.title}>Admin Access</h1>
        <p className={styles.subtitle}>Training Platform Dashboard</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className={styles.input}
              placeholder="Username"
              autoComplete="username"
              autoFocus
              spellCheck={false}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="Password"
              autoComplete="current-password"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Back to Training
        </button>
      </motion.div>
    </div>
  )
}
