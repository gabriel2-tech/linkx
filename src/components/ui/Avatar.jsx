import styles from './Avatar.module.css'

export default function Avatar({ src, firstName = '', lastName = '', size = 'normal' }) {
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || '?'
  return <span className={size === 'large' ? `${styles.avatar} ${styles.large}` : styles.avatar}>
    {src ? <img src={src} alt="" /> : initials}
  </span>
}
