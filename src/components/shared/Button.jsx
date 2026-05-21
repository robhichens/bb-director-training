import styles from './Button.module.css'

export default function Button({
  variant = 'primary',
  pill = false,
  children,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...rest
}) {
  const cls = [
    styles.btn,
    styles[variant],
    pill ? styles.pill : '',
    disabled ? styles.disabled : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={cls}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}
