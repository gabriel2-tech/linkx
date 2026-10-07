import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendResetEmail } from '@/services/authService'
import { validateEmail } from '@/utils/validators'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import styles from './AuthPages.module.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [pending, setPending] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const validation = validateEmail(email)
    if (validation) { setError(validation); return }
    setError('')
    setPending(true)
    await sendResetEmail(email.trim())
    setPending(false)
    setSent(true)
  }

  return (
    <div className={styles.page}>
      <Card>
        <div className={styles.brand}>link</div>
        <h1>Réinitialiser ton mot de passe</h1>
        <p className={styles.intro}>Entre ton adresse e-mail pour recevoir un lien.</p>
        {sent ? <p className={styles.success} role="status">Si cette adresse existe, un lien de réinitialisation vient d’être envoyé.</p> : (
          <form onSubmit={submit} noValidate>
            <Input label="Adresse e-mail" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
            <Button type="submit" loading={pending}>Envoyer le lien</Button>
          </form>
        )}
        <Link className={styles.link} to="/login">Retour à la connexion</Link>
      </Card>
    </div>
  )
}
