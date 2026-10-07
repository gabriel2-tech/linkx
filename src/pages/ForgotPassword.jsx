import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendResetEmail } from '@/services/authService'
import { validateEmail } from '@/utils/validators'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import styles from './AuthPages.module.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [pending, setPending] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const validation = validateEmail(email)
    if (validation) {
      setError(validation)
      return
    }
    setError('')
    setPending(true)
    await sendResetEmail(email.trim())
    setPending(false)
    setSent(true)
  }

  return (
    <main className={styles.simplePage}>
      <section className={styles.forgotBox}>
        <Link className={styles.back} to="/login" aria-label="Retour à la connexion">‹</Link>
        <div className={styles.centerBrand}>link</div>
        <h1>Mot de passe oublié ?</h1>
        <p className={styles.intro}>
          Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {sent ? (
          <div className={styles.successBox} role="status">
            <strong>Vérifiez votre boîte mail.</strong>
            <p>Si cette adresse existe, un lien de réinitialisation vient d’être envoyé.</p>
          </div>
        ) : (
          <form className={styles.authForm} onSubmit={submit} noValidate>
            <Input
              label="Adresse e-mail"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />
            <Button type="submit" loading={pending}>Envoyer le lien</Button>
          </form>
        )}

        <Link className={styles.accountButton} to="/login">Retour à la connexion</Link>
      </section>

      <footer className={styles.siteFooter}>
        <span>Français (France)</span><span>English (US)</span><span>À propos</span><span>Confidentialité</span><span>Conditions générales</span>
      </footer>
    </main>
  )
}
