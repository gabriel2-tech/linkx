import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { updateProfile, uploadAvatar } from '@/services/profileService'
import { validateProfile } from '@/utils/validators'
import { translateProfileError } from '@/utils/errors'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import FormError from '@/components/ui/FormError'
import Card from '@/components/ui/Card'
import AvatarUploader from '@/components/profile/AvatarUploader'
import styles from './Profile.module.css'

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth()
  const [form, setForm] = useState({ first_name: '', last_name: '', gender: '', bio: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        gender: profile.gender || '',
        bio: profile.bio || '',
      })
    }
  }, [profile])

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function save(event) {
    event.preventDefault()
    setSuccess('')
    setServerError('')
    const nextErrors = validateProfile(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setPending(true)
    const { error } = await updateProfile(user.id, {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      gender: form.gender,
      bio: form.bio,
    })
    setPending(false)
    if (error) { setServerError(translateProfileError()); return }
    await refreshProfile()
    setSuccess('Profil mis à jour.')
  }

  async function avatarChanged(file) {
    setServerError('')
    const { error } = await uploadAvatar(user.id, file)
    if (error) setServerError('Impossible de mettre à jour la photo.')
    else {
      await refreshProfile()
      setSuccess('Photo mise à jour.')
    }
  }

  return (
    <section className={styles.page}>
      <Card wide>
        <div className={styles.heading}>
          <Avatar src={profile?.avatar_url} firstName={profile?.first_name} lastName={profile?.last_name} size="large" />
          <div><p className={styles.eyebrow}>Mon profil</p><h1>{profile ? `${profile.first_name} ${profile.last_name}` : 'Profil'}</h1></div>
        </div>
        <AvatarUploader onChange={avatarChanged} />
        <form onSubmit={save} noValidate>
          <div className={styles.row}>
            <Input label="Prénom" name="first_name" autoComplete="given-name" value={form.first_name} onChange={change} error={errors.first_name} />
            <Input label="Nom" name="last_name" autoComplete="family-name" value={form.last_name} onChange={change} error={errors.last_name} />
          </div>
          <Select label="Genre" name="gender" value={form.gender} onChange={change} error={errors.gender} options={[
            { value: 'femme', label: 'Femme' },
            { value: 'homme', label: 'Homme' },
            { value: 'personnalise', label: 'Personnalisé' },
          ]} placeholder="Sélectionnez votre genre" />
          <label className={styles.textareaLabel} htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" maxLength={300} value={form.bio} onChange={change} aria-describedby="bio-help" />
          <div id="bio-help" className={styles.counter}>{form.bio.length}/300</div>
          {errors.bio && <p className={styles.fieldError}>{errors.bio}</p>}
          <FormError message={serverError} />
          {success && <p className={styles.success} role="status">{success}</p>}
          <Button type="submit" loading={pending}>Enregistrer les modifications</Button>
        </form>
      </Card>
    </section>
  )
}
