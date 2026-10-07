import Spinner from './Spinner'
import styles from './Button.module.css'

export default function Button({ loading = false, children, disabled, ...props }) {
  return <button className={styles.button} disabled={disabled || loading} {...props}>{loading && <Spinner small />}{children}</button>
}
