import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProgress } from '../../context/ProgressContext'
import ProgressBar from '../shared/ProgressBar'
import styles from './Header.module.css'

export default function Header({ onMenuToggle, sidebarOpen }) {
  const { user, logout }  = useAuth()
  const { overallPct }    = useProgress()
  const navigate           = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.menuBtn}
          onClick={onMenuToggle}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={sidebarOpen}
        >
          <span className={styles.menuIcon}>
            <span /><span /><span />
          </span>
        </button>
        <img
          src="/images/bb-logo-full-color.png"
          alt="Bright Beginnings"
          className={styles.logo}
        />
      </div>

      <div className={styles.center}>
        <div className={styles.progressWrap}>
          <ProgressBar progress={overallPct} />
          <span className={styles.progressLabel}>{overallPct}% complete</span>
        </div>
      </div>

      <div className={styles.right}>
        {user && (
          <>
            <span className={styles.userName}>{user.name}</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  )
}
