import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../data/competenciesData'
import { loadCompetencies, getOverallProgress, fmtDate } from '../utils/competencyTracker'
import styles from './CompetenciesPrint.module.css'

export default function CompetenciesPrint() {
  const { user } = useAuth()
  const data = useMemo(() => loadCompetencies(), [])
  const { completed, total, pct } = getOverallProgress(data)

  const printDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className={styles.page}>
      {/* Print header */}
      <div className={styles.printHeader}>
        <div>
          <h1 className={styles.title}>Bright Beginnings</h1>
          <h2 className={styles.subtitle}>Director Competency Tracker</h2>
        </div>
        <div className={styles.meta}>
          <p><strong>Director:</strong> {user?.name ?? '—'}</p>
          <p><strong>Location:</strong> {user?.location ?? '—'}</p>
          <p><strong>Printed:</strong> {printDate}</p>
          <p><strong>Progress:</strong> {completed}/{total} completed ({pct}%)</p>
        </div>
      </div>

      <p className={styles.note}>All topics should be introduced within the first 6 weeks.</p>

      {/* Print button — hidden when printing */}
      <button className={styles.printBtn} onClick={() => window.print()}>
        🖨 Print / Save as PDF
      </button>

      {/* Categories */}
      {CATEGORIES.map(cat => {
        const catItems = cat.items.map(item => ({
          ...item,
          itemData: data.items[item.id] ?? { introduced: false, completed: false, introducedDate: null, completedDate: null },
        }))
        const catDone = catItems.filter(i => i.itemData.completed).length

        return (
          <div key={cat.id} className={styles.category}>
            <div className={styles.catHeader}>
              <span className={styles.catTitle}>{cat.title}</span>
              <span className={styles.catProgress}>{catDone}/{catItems.length}</span>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.colItem}>Competency</th>
                  <th className={styles.colStatus}>Introduced</th>
                  <th className={styles.colStatus}>Completed</th>
                </tr>
              </thead>
              <tbody>
                {catItems.map(({ id, label, itemData }) => (
                  <tr key={id} className={itemData.completed ? styles.rowDone : ''}>
                    <td className={styles.cellItem}>{label}</td>
                    <td className={styles.cellStatus}>
                      {itemData.introduced
                        ? <span className={styles.checkDone}>✓ {fmtDate(itemData.introducedDate)}</span>
                        : <span className={styles.checkBlank}>—</span>}
                    </td>
                    <td className={styles.cellStatus}>
                      {itemData.completed
                        ? <span className={styles.checkDone}>✓ {fmtDate(itemData.completedDate)}</span>
                        : <span className={styles.checkBlank}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
