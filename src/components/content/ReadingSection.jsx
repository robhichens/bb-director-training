import { createContext, useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion } from 'framer-motion'
import Button from '../shared/Button'
import styles from './ReadingSection.module.css'

const CardListCtx = createContext(false)

function MarkdownUl({ node, children, ...props }) {
  const liCount = node?.children?.filter(c => c.type === 'element' && c.tagName === 'li').length ?? 0
  if (liCount > 5) {
    return (
      <CardListCtx.Provider value={true}>
        <div className={styles.cardGrid}>{children}</div>
      </CardListCtx.Provider>
    )
  }
  return <ul {...props}>{children}</ul>
}

function MarkdownLi({ children, ...props }) {
  const isCard = useContext(CardListCtx)
  if (isCard) {
    return (
      <div className={styles.bulletCard}>
        <span className={styles.bulletDot} aria-hidden="true" />
        <span className={styles.bulletText}>{children}</span>
      </div>
    )
  }
  return <li {...props}>{children}</li>
}

const mdComponents = { ul: MarkdownUl, li: MarkdownLi }

export default function ReadingSection({ title, content, learningObjectives = [], onComplete, completed }) {
  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <h2 className={styles.title}>{title}</h2>

      {learningObjectives.length > 0 && (
        <div className={styles.objectives}>
          <p className={styles.objectivesLabel}>In this section you'll learn to:</p>
          <ul className={styles.objectivesList}>
            {learningObjectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.markdown}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {content}
        </ReactMarkdown>
      </div>

      <div className={styles.footer}>
        {completed ? (
          <p className={styles.completedNote}>✓ Section complete — continue in the sidebar</p>
        ) : (
          <Button variant="primary" pill onClick={onComplete}>
            Mark as Read &amp; Continue
          </Button>
        )}
      </div>
    </motion.div>
  )
}
