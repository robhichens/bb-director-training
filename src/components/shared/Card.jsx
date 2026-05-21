import styles from './Card.module.css'

export default function Card({ children, hoverable = false, className = '', ...rest }) {
  const cls = [styles.card, hoverable ? styles.hoverable : '', className].filter(Boolean).join(' ')
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  )
}
