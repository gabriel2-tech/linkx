import styles from './Select.module.css'

export default function Select({ label, name, options, placeholder, error, ...props }) {
  const id = props.id || name
  const errorId = `${id}-error`
  return <div className={styles.field}>
    <label htmlFor={id}>{label}</label>
    <select id={id} name={name} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props}>
      <option value="">{placeholder}</option>
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    {error && <p id={errorId} className={styles.error}>{error}</p>}
  </div>
}
