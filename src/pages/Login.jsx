import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signIn } from '@/services/authService'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import FormError from '@/components/ui/FormError'
import styles from './AuthPages.module.css'

function BrandMark() {
  return <div className={styles.brand}>LinkX</div>
}

function VisualPanel() {
  return (
    <aside className={styles.visual} aria-hidden="true">
      <BrandMark />
      <div className={styles.visualStage}>
        <div className={styles.storyCard + ' ' + styles.storyBack}>
          <div className={styles.storyHeader}><span /><span /><span /></div>
          <div className={styles.abstractImage}>
            <div className={styles.abstractSun} />
            <div className={styles.abstractShape} />
            <div className={styles.abstractLine} />
          </div>
        </div>
        <div className={styles.storyCard + ' ' + styles.storyMain}>
          <div className={styles.storyHeader}><span /><span /><span /></div>
          <div className={styles.abstractImage + ' ' + styles.portrait}>
            <div className={styles.portraitHead} />
            <div className={styles.portraitBody} />
          </div>
          <div className={styles.progress}><i /><i /><i /><i /></div>
        </div>
        <div className={styles.storyCard + ' ' + styles.storyFront}>
          <div className={styles.miniPhoto}>
            <div className={styles.miniSun} />
            <div className={styles.miniHill} />
          </div>
          <div className={styles.frontText}>partage<br />l’instant</div>
        </div>
        <div className={styles.orbitOne} />
        <div className={styles.orbitTwo}>✦</div>
      </div>
      <div className={styles.visualCopy}>
        <p>Pas de paillettes,</p>
        <p>juste <strong>vous.</strong></p>
      </div>
    </aside>
  )
}

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
    const destination = from?.pathname
      ? from.pathname + (from.search ?? '') + (from.hash ?? '')
      : '/'
    navigate(destination, { replace: true })
  }

  return (
    <main className={styles.page}>
      <VisualPanel />
      <section className={styles.formPanel}>
        <div className={styles.formBox}>
          <div className={styles.mobileBrand}><BrandMark /></div>
          <h1>Se connecter à LinkX</h1>
          <p className={styles.intro}>Retrouvez votre espace et partagez vos instants.</p>
          <form onSubmit={submit} noValidate>
            <Input label="Adresse e-mail" name="email" type="email" autoComplete="email" value={form.email} onChange={change} required />
            <PasswordInput label="Mot de passe" name="password" autoComplete="current-password" value={form.password} onChange={change} required />
            <FormError message={error} />
            <Button type="submit" loading={pending}>Se connecter</Button>
          </form>
          <Link className={styles.link} to="/forgot-password">Mot de passe oublié ?</Link>
          <Link className={styles.secondary} to="/signup">Créer un nouveau compte</Link>
        </div>
        <footer className={styles.footer}>© {new Date().getFullYear()} LinkX</footer>
      </section>
    </main>
  )
}
