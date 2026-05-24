import { getCategoryProgress } from '../../utils/competencyTracker'
import CompetencyItem from './CompetencyItem'
import styles from './CategoryAccordion.module.css'

export default function CategoryAccordion({ category, data, isOpen, onToggle, onMarkIntroduced, onMarkCompleted, onUncheckIntroduced, onUncheckCompleted }) {
  const { completed, total } = getCategoryProgress(data, category.id)
  const allDone = total > 0 && completed === total

  return (
    <div className={`${styles.accordion} ${allDone ? styles.accordionDone : ''}`}>
      {/* Header */}
      <button className={styles.header} onClick={onToggle} aria-expanded={isOpen}>
        <div className={styles.headerLeft}>
          <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>›</span>
          <span className={`${styles.title} ${allDone ? styles.titleDone : ''}`}>{category.title}</span>
        </div>
        <span className={`${styles.pill} ${allDone ? styles.pillDone : ''}`}>
          {allDone ? 'Done! ✓' : `${completed}/${total}`}
        </span>
      </button>

      {/* Items */}
      {isOpen && (
        <div className={styles.body}>
          {category.items.map(item => (
            <CompetencyItem
              key={item.id}
              item={item}
              itemData={data.items[item.id] ?? { introduced: false, introducedDate: null, completed: false, completedDate: null }}
              onMarkIntroduced={onMarkIntroduced}
              onMarkCompleted={onMarkCompleted}
              onUncheckIntroduced={onUncheckIntroduced}
              onUncheckCompleted={onUncheckCompleted}
            />
          ))}
        </div>
      )}
    </div>
  )
}
