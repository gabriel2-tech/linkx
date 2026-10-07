import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { updatePassword } from '@/services/authService'
import { validatePassword } from '@/utils/validators'
import Button from '@/components/ui/Button'
import PasswordInput from '@/components/ui/PasswordInput'
import Card from '@/components/ui/Card'
import FormError from '@/components/ui/FormError'
import styles from './AuthPages.module.css'

export default function ResetPassword() {
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [recovery, setRecovery] = useState(false)

  useEffect(() => {
    if (loading) return undefined
    if (session) setRecovery(true)

    let active = true
    const { data: subscription } = window.__supabaseAuthSubscription ?? { data: { subscription: null } }
    void subscription
    return () => { active = false }
  }, [loading, session])

  useEffect(() => {
    let active = true
    return () => { active = false }
  }, [])

  async function submit(event) {
    event.preventDefault()
    const validation = validatePassword(password)
    if (validation) { setError(validation); return }
    if (password !== confirmation) { setError('Les mots de passe ne correspondent pas.'); return }
    setError('')
    setPending(true)
    const { error: updateError } = await updatePassword(password)
    setPending(false)
    if (updateError) { setError('Impossible de modifier le mot de passe. Le lien est peut-être expiré.'); return }
    navigate('/', { replace: true })
  }

  if (loading) return <div className="route-loading"><span className="spinner" aria-label="Chargement" /></div>

  return (
    <div className={styles.page}>
      <Card>
        <div className={styles.brand}>link</div>
        <h1>Nouveau mot de passe</h1>
        {!recovery ? (
          <>
            <p className={styles.errorText}>Ce lien est invalide ou a expiré.</p>
            <Link className={styles.secondary} to="/forgot-password">Demander un nouveau lien</Link>
          </>
        ) : (
          <form onSubmit={submit} noValidate>
            <PasswordInput label="Nouveau mot de passe" name="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <PasswordInput label="Confirmer le mot de passe" name="confirmation" autoComplete="new-password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
            <FormError message={error} />
            <Button type="submit" loading={pending}>Enregistrer</Button>
          </form>
        )}
      </Card>
    </div>
  )
}
