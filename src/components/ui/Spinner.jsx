import styles from './Spinner.module.css'

export default function Spinner({ small = false }) {
  return <span className={small ? `${styles.spinner} ${styles.small}` : styles.spinner} aria-hidden="true" />
}
