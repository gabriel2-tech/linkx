import styles from './Input.module.css'

export default function Input({ label, name, error, ...props }) {
  const id = props.id || name
  const errorId = `${id}-error`
  return <div className={styles.field}>
    <label htmlFor={id}>{label}</label>
    <input id={id} name={name} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props} />
    {error && <p id={errorId} className={styles.error}>{error}</p>}
  </div>
}
