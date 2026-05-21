import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import styles from './ModuleLayout.module.css'

export default function ModuleLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={styles.root}>
      <Header
        onMenuToggle={() => setSidebarOpen(p => !p)}
        sidebarOpen={sidebarOpen}
      />
      <div className={styles.body}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={styles.main}>
          <div className={styles.content}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
