import styles from './Card.module.css'

export default function Card({ children, wide = false }) {
  return <div className={wide ? `${styles.card} ${styles.wide}` : styles.card}>{children}</div>
}
