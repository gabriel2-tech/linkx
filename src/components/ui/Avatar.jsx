import styles from './Avatar.module.css'

export default function Avatar({ src, firstName = '', lastName = '', size = 'normal' }) {
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || '?'
  const sizeClass = {
    small: styles.small,
    normal: styles.avatar,
    large: styles.large,
    xlarge: styles.xlarge,
  }[size] || styles.avatar

  return (
    <span className={sizeClass}>
      {src ? <img src={src} alt="" /> : initials}
    </span>
  )
}
