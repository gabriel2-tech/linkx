import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '@/services/authService'
import { validateSignup } from '@/utils/validators'
import { formatBirthDate } from '@/utils/dates'
import { translateAuthError } from '@/utils/errors'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import Select from '@/components/ui/Select'
import BirthDateSelect from '@/components/auth/BirthDateSelect'
import FormError from '@/components/ui/FormError'
import styles from './AuthPages.module.css'

const initialForm = {
  first_name: '', last_name: '', birth_date: { day: '', month: '', year: '' },
  gender: '', email: '', password: '',
}

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')
  const [pending, setPending] = useState(false)

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function setBirthDate(value) {
    setForm((current) => ({ ...current, birth_date: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setServerError('')
    setSuccess('')
    const nextErrors = validateSignup(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setPending(true)
    const { data, error } = await signUp({
      email: form.email.trim(),
      password: form.password,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      birth_date: formatBirthDate(form.birth_date.year, form.birth_date.month, form.birth_date.day),
      gender: form.gender,
    })
    setPending(false)

    if (error) {
      setServerError(translateAuthError(error))
      return
    }

    if (data?.session) navigate('/', { replace: true })
    else setSuccess('Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse.')
  }

  return (
    <main className={styles.simplePage}>
      <section className={styles.signupBox}>
        <Link className={styles.back} to="/login" aria-label="Retour à la connexion">‹</Link>
        <div className={styles.centerBrand}>LinkX</div>
        <h1>Créer un compte</h1>
        <p className={styles.intro}>Quelques informations suffisent pour commencer sur LinkX.</p>

        <form className={styles.authForm} onSubmit={submit} noValidate>
          <div className={styles.row}>
            <Input label="Prénom" name="first_name" autoComplete="given-name" value={form.first_name} onChange={change} error={errors.first_name} />
            <Input label="Nom" name="last_name" autoComplete="family-name" value={form.last_name} onChange={change} error={errors.last_name} />
          </div>

          <BirthDateSelect value={form.birth_date} onChange={setBirthDate} error={errors.birth_date} />

          <Select label="Genre" name="gender" value={form.gender} onChange={change} error={errors.gender} options={[
            { value: 'femme', label: 'Femme' },
            { value: 'homme', label: 'Homme' },
            { value: 'personnalise', label: 'Personnalisé' },
          ]} placeholder="Sélectionnez votre genre" />

          <div>
            <Input label="Adresse e-mail" name="email" type="email" autoComplete="email" value={form.email} onChange={change} error={errors.email} />
            <p className={styles.helper}>Vous pouvez utiliser cette adresse pour vous connecter à votre compte.</p>
          </div>

          <PasswordInput label="Mot de passe" name="password" autoComplete="new-password" value={form.password} onChange={change} error={errors.password} />

          <p className={styles.legal}>
            En appuyant sur <strong>Créer un compte</strong>, vous acceptez nos conditions d’utilisation et notre politique de confidentialité.
          </p>

          <FormError message={serverError} />
          {success && <p className={styles.success} role="status">{success}</p>}
          <Button type="submit" loading={pending}>Créer un compte</Button>
        </form>

        <Link className={styles.accountButton} to="/login">J’ai déjà un compte</Link>
      </section>

      <footer className={styles.siteFooter}>
        <span>Français (France)</span><span>English (US)</span><span>À propos</span><span>Confidentialité</span><span>Conditions générales</span>
      </footer>
    </main>
  )
}
