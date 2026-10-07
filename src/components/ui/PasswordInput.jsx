import { useState } from 'react'
import styles from './PasswordInput.module.css'

export default function PasswordInput({ label, name, error, ...props }) {
  const [visible, setVisible] = useState(false)
  const id = props.id || name
  const errorId = `${id}-error`
  return <div className={styles.field}>
    <label htmlFor={id}>{label}</label>
    <div className={styles.wrap}>
      <input id={id} name={name} type={visible ? 'text' : 'password'} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props} />
      <button type="button" className={styles.toggle} onClick={() => setVisible((value) => !value)} aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{visible ? 'Masquer' : 'Afficher'}</button>
    </div>
    {error && <p id={errorId} className={styles.error}>{error}</p>}
  </div>
}
