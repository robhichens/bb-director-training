import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Button from '../shared/Button'
import styles from './Auth.module.css'

const LOCATIONS = ['Forest Lakes', 'Mill Creek', 'Crozet']

export default function Signup() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]   = useState({ email: '', name: '', location: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    const email = form.email.trim().toLowerCase()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Please enter a valid email address.'
    }
    if (!form.name.trim()) {
      e.name = 'Please enter your full name.'
    }
    if (!form.location) {
      e.location = 'Please select your location.'
    }
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setLoading(true)
    const user = {
      email:     form.email.trim().toLowerCase(),
      name:      form.name.trim(),
      location:  form.location,
      createdAt: new Date().toISOString(),
    }
    login(user)
    navigate('/dashboard')
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

        <h1 className={styles.title}>Create Your Account</h1>
        <p className={styles.subtitle}>Let's get your training started</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Jane Smith"
              autoFocus
            />
            {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="you@brightbeginningsva.com"
              autoComplete="email"
            />
            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="location" className={styles.label}>Your Location</label>
            <select
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              className={`${styles.input} ${styles.select} ${errors.location ? styles.inputError : ''}`}
            >
              <option value="">Select your site…</option>
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            {errors.location && <span className={styles.fieldError}>{errors.location}</span>}
          </div>

          <Button type="submit" pill disabled={loading} className={styles.submitBtn}>
            {loading ? 'Creating account…' : 'Start Training'}
          </Button>
        </form>

        <p className={styles.switchLink}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </motion.div>

      <div className={styles.birds}>
        <img src="/images/3birds-coral.png" alt="" aria-hidden="true" />
      </div>
    </div>
  )
}
