import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { db } from '../../lib/firebase'
import { isAdminAuthed, clearAdminSession } from './adminAuth'
import styles from './AdminDashboard.module.css'

const MODULE_ORDER = ['module1', 'module2', 'module3', 'module4', 'module5', 'module6', 'module7']
const MODULE_LABELS = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7']
const MODULE_NAMES = [
  'Foundation & Culture',
  'Daily Operations',
  'People Management',
  'Business Operations',
  'Compliance & Safety',
  'Communication & Community',
  'Reference Library',
]

function statusClass(status) {
  if (status === 'completed')   return styles.statusDone
  if (status === 'in-progress') return styles.statusActive
  if (status === 'not-started') return styles.statusNotStarted
  return styles.statusLocked
}

function statusLabel(status) {
  if (status === 'completed')   return '✓'
  if (status === 'in-progress') return '▶'
  if (status === 'not-started') return '—'
  return '🔒'
}

function formatDate(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatRelative(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  const now = new Date()
  const diff = now - d
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 2)    return 'just now'
  if (mins < 60)   return `${mins}m ago`
  if (hours < 24)  return `${hours}h ago`
  if (days === 1)  return 'yesterday'
  if (days < 7)    return `${days}d ago`
  return formatDate(ts)
}

function StatCard({ label, value, sub }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
      {sub && <span className={styles.statSub}>{sub}</span>}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate  = useNavigate()
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [sortKey, setSortKey] = useState('lastUpdated')
  const [sortDir, setSortDir] = useState('desc')
  const [filter, setFilter]   = useState('all') // all | Forest Lakes | Mill Creek | Crozet

  // Guard — redirect to login if not authed
  useEffect(() => {
    if (!isAdminAuthed()) {
      navigate('/admin/login', { replace: true })
    }
  }, [navigate])

  // Fetch from Firestore
  useEffect(() => {
    if (!isAdminAuthed()) return
    setLoading(true)
    getDocs(query(collection(db, 'userProgress')))
      .then(snap => {
        const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setUsers(rows)
      })
      .catch(e => {
        console.error(e)
        setError('Could not load user data. Check Firestore permissions.')
      })
      .finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    clearAdminSession()
    navigate('/admin/login')
  }

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  // Compute summary stats
  const total     = users.length
  const completed = users.filter(u => u.overallPct === 100).length
  const active    = users.filter(u => u.overallPct > 0 && u.overallPct < 100).length
  const notStarted = users.filter(u => !u.overallPct || u.overallPct === 0).length
  const avgPct    = total > 0 ? Math.round(users.reduce((s, u) => s + (u.overallPct || 0), 0) / total) : 0

  // Filter
  const filtered = users.filter(u => filter === 'all' || u.location === filter)

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let av, bv
    if (sortKey === 'name')     { av = (a.name || '').toLowerCase(); bv = (b.name || '').toLowerCase() }
    if (sortKey === 'location') { av = (a.location || '').toLowerCase(); bv = (b.location || '').toLowerCase() }
    if (sortKey === 'pct')      { av = a.overallPct || 0; bv = b.overallPct || 0 }
    if (sortKey === 'lastUpdated') {
      av = a.lastUpdated?.toDate?.() ?? new Date(0)
      bv = b.lastUpdated?.toDate?.() ?? new Date(0)
    }
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ?  1 : -1
    return 0
  })

  function SortIcon({ k }) {
    if (sortKey !== k) return <span className={styles.sortNeutral}>↕</span>
    return <span className={styles.sortActive}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  if (!isAdminAuthed()) return null

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img src="/images/bb-logo-full-color.png" alt="Bright Beginnings" className={styles.logo} />
          <div>
            <h1 className={styles.headerTitle}>Training Admin</h1>
            <p className={styles.headerSub}>Director Training Platform</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
            ← Training Portal
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {/* Stats row */}
        <motion.div
          className={styles.statsRow}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatCard label="Total Users"    value={total}       />
          <StatCard label="Completed"      value={completed}   sub="all 7 modules" />
          <StatCard label="In Progress"    value={active}      sub="started" />
          <StatCard label="Not Started"    value={notStarted}  sub="0% complete" />
          <StatCard label="Avg Progress"   value={`${avgPct}%`} />
        </motion.div>

        {/* Filter bar */}
        <div className={styles.toolbar}>
          <div className={styles.filters}>
            {['all', 'Forest Lakes', 'Mill Creek', 'Crozet'].map(loc => (
              <button
                key={loc}
                className={`${styles.filterBtn} ${filter === loc ? styles.filterActive : ''}`}
                onClick={() => setFilter(loc)}
              >
                {loc === 'all' ? 'All Locations' : loc}
              </button>
            ))}
          </div>
          <span className={styles.rowCount}>{sorted.length} user{sorted.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Table */}
        {loading && (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
            <p>Loading user data…</p>
          </div>
        )}

        {error && (
          <div className={styles.errorWrap}>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && sorted.length === 0 && (
          <div className={styles.emptyWrap}>
            <img src="/images/bird-coral.png" alt="" style={{ height: 48, opacity: 0.3, marginBottom: 12 }} />
            <p>No users found yet. Users appear here after signing up and making progress.</p>
          </div>
        )}

        {!loading && !error && sorted.length > 0 && (
          <motion.div
            className={styles.tableWrap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>
                    <button className={styles.sortBtn} onClick={() => toggleSort('name')}>
                      Name <SortIcon k="name" />
                    </button>
                  </th>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>
                    <button className={styles.sortBtn} onClick={() => toggleSort('location')}>
                      Location <SortIcon k="location" />
                    </button>
                  </th>
                  <th className={styles.th}>
                    <button className={styles.sortBtn} onClick={() => toggleSort('pct')}>
                      Overall <SortIcon k="pct" />
                    </button>
                  </th>
                  {MODULE_LABELS.map((lbl, i) => (
                    <th key={lbl} className={`${styles.th} ${styles.thModule}`} title={MODULE_NAMES[i]}>
                      {lbl}
                    </th>
                  ))}
                  <th className={styles.th}>
                    <button className={styles.sortBtn} onClick={() => toggleSort('lastUpdated')}>
                      Last Active <SortIcon k="lastUpdated" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    className={styles.row}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.02 }}
                  >
                    <td className={`${styles.td} ${styles.tdName}`}>{user.name || '—'}</td>
                    <td className={`${styles.td} ${styles.tdEmail}`}>{user.userId || '—'}</td>
                    <td className={styles.td}>
                      <span className={styles.locationBadge}>{user.location || '—'}</span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.pctWrap}>
                        <div className={styles.pctBar}>
                          <div
                            className={styles.pctFill}
                            style={{ width: `${user.overallPct || 0}%` }}
                          />
                        </div>
                        <span className={styles.pctLabel}>{user.overallPct || 0}%</span>
                      </div>
                    </td>
                    {MODULE_ORDER.map(modId => {
                      const status = user.modules?.[modId]?.status || 'locked'
                      return (
                        <td key={modId} className={styles.td}>
                          <span className={`${styles.statusPip} ${statusClass(status)}`} title={status}>
                            {statusLabel(status)}
                          </span>
                        </td>
                      )
                    })}
                    <td className={`${styles.td} ${styles.tdDate}`}>
                      {formatRelative(user.lastUpdated)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Legend */}
        {!loading && sorted.length > 0 && (
          <div className={styles.legend}>
            <span className={`${styles.legendPip} ${styles.statusDone}`}>✓</span> Completed &nbsp;&nbsp;
            <span className={`${styles.legendPip} ${styles.statusActive}`}>▶</span> In Progress &nbsp;&nbsp;
            <span className={`${styles.legendPip} ${styles.statusNotStarted}`}>—</span> Not Started &nbsp;&nbsp;
            <span className={`${styles.legendPip} ${styles.statusLocked}`}>🔒</span> Locked
          </div>
        )}
      </main>
    </div>
  )
}
