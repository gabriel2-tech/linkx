import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signIn } from '@/services/authService'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import Card from '@/components/ui/Card'
import FormError from '@/components/ui/FormError'
import styles from './AuthPages.module.css'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setPending(true)
    const { error: authError } = await signIn(form.email.trim(), form.password)
    setPending(false)
    if (authError) {
      setError(authError.message?.toLowerCase().includes('email not confirmed')
        ? 'Confirme d’abord ton adresse e-mail via le lien reçu.'
        : 'E-mail ou mot de passe incorrect.')
      return
    }
    const from = location.state?.from
    const destination = from?.pathname ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}` : '/'
    navigate(destination, { replace: true })
  }

  return (
    <div className={styles.page}>
      <Card>
        <div className={styles.brand}>link</div>
        <h1>Se connecter à link</h1>
        <p className={styles.intro}>Retrouve ton espace et partage tes vidéos éphémères.</p>
        <form onSubmit={submit} noValidate>
          <Input label="Adresse e-mail" name="email" type="email" autoComplete="email" value={form.email} onChange={change} required />
          <PasswordInput label="Mot de passe" name="password" autoComplete="current-password" value={form.password} onChange={change} required />
          <FormError message={error} />
          <Button type="submit" loading={pending}>Se connecter</Button>
        </form>
        <Link className={styles.link} to="/forgot-password">Mot de passe oublié ?</Link>
        <Link className={styles.secondary} to="/signup">Créer un nouveau compte</Link>
      </Card>
    </div>
  )
}
