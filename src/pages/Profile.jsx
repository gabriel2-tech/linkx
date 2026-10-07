import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { updateProfile, uploadAvatar } from '@/services/profileService'
import { validateProfile } from '@/utils/validators'
import { translateProfileError } from '@/utils/errors'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import FormError from '@/components/ui/FormError'
import AvatarUploader from '@/components/profile/AvatarUploader'
import styles from './Profile.module.css'

const friends = [
  { name: 'Ami link', initials: 'AL' },
  { name: 'Créateur', initials: 'CR' },
  { name: 'Mon ami', initials: 'MA' },
  { name: 'Contact', initials: 'CO' },
  { name: 'Ami proche', initials: 'AP' },
  { name: 'Nouveau contact', initials: 'NC' },
]

const publications = [
  { type: 'text', text: 'Bienvenue sur link. Partagez vos moments, vos idées et ce qui compte pour vous.' },
  { type: 'photo', text: 'Un moment à partager.' },
  { type: 'video', text: 'Une petite vidéo à regarder.' },
]

function InitialAvatar({ name, initials, imageUrl = '' }) {
  const fallback = useMemo(
    () => initials || name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
    [name, initials],
  )

  return (
    <span className={styles.friendAvatar} aria-hidden="true">
      {imageUrl ? <img src={imageUrl} alt="" /> : fallback}
    </span>
  )
}

function Publication({ publication, profile }) {
  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Vous'

  return (
    <article className={styles.publication}>
      <header className={styles.publicationHeader}>
        <Avatar src={profile?.avatar_url} firstName={profile?.first_name} lastName={profile?.last_name} size="small" />
        <div>
          <strong>{name}</strong>
          <span>Il y a quelque temps · Amis</span>
        </div>
        <button type="button" className={styles.moreButton} aria-label="Plus d'options">•••</button>
      </header>

      <p className={styles.publicationText}>{publication.text}</p>

      {publication.type === 'photo' && (
        <div className={[styles.media, styles.photoMedia].join(' ')} role="img" aria-label="Photo de publication">
          <span>PHOTO</span>
        </div>
      )}

      {publication.type === 'video' && (
        <div className={[styles.media, styles.videoMedia].join(' ')} role="img" aria-label="Vidéo de publication">
          <span className={styles.playButton}>▶</span>
          <strong>VIDÉO</strong>
        </div>
      )}

      <footer className={styles.publicationFooter}>
        <button type="button">Commenter</button>
        <button type="button">Partager</button>
      </footer>
    </article>
  )
}

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth()
  const [form, setForm] = useState({ first_name: '', last_name: '', gender: '', bio: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')
  const [pending, setPending] = useState(false)
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('publications')
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    if (!profile) return
    setForm({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      gender: profile.gender || '',
      bio: profile.bio || '',
    })
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

    if (error) {
      setServerError(translateProfileError())
      return
    }

    await refreshProfile()
    setSuccess('Profil mis à jour.')
    setEditing(false)
  }

  async function avatarChanged(file) {
    setServerError('')
    const { error } = await uploadAvatar(user.id, file)

    if (error) {
      setServerError('Impossible de mettre à jour la photo.')
      return
    }

    await refreshProfile()
    setSuccess('Photo mise à jour.')
  }

  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Votre profil'
  const bio = profile?.bio?.trim() || 'Bienvenue sur mon profil link.'
  const visiblePublications = activeTab === 'publications'
    ? publications
    : publications.filter((publication) => publication.type === activeTab.slice(0, -1))

  return (
    <main className={styles.page}>
      <section className={styles.profileCard}>
        <div className={styles.cover}>
          <div className={styles.coverPattern} aria-hidden="true" />
        </div>

        <div className={styles.identity}>
          <div className={styles.avatarWrap}>
            <Avatar
              src={profile?.avatar_url}
              firstName={profile?.first_name}
              lastName={profile?.last_name}
              size="xlarge"
            />
            <AvatarUploader onChange={avatarChanged} compact />
          </div>

          <div className={styles.identityText}>
            <h1>{name}</h1>
            <p className={styles.friendCount}>Amis</p>
            <p className={styles.bio}>{bio}</p>
          </div>

          <div className={styles.profileActions}>
            <button type="button" className={styles.editProfileButton} onClick={() => setEditing((value) => !value)}>
              {editing ? 'Fermer' : 'Modifier le profil'}
            </button>
            <button
              type="button"
              className={styles.moreProfileButton}
              aria-label="Plus d'options du profil"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((value) => !value)}
            >
              ⋯
            </button>
            {moreOpen && (
              <div className={styles.moreMenu}>
                <Link to="/friends" onClick={() => setMoreOpen(false)}>
                  <span>👥</span>
                  <span><strong>Amis</strong><small>Voir tous mes amis</small></span>
                </Link>
              </div>
            )}
          </div>
        </div>

        <nav className={styles.profileTabs} aria-label="Navigation du profil">
          <button type="button" className={activeTab === 'publications' ? styles.activeTab : ''} onClick={() => setActiveTab('publications')}>
            Publications
          </button>
          <button type="button" className={activeTab === 'photos' ? styles.activeTab : ''} onClick={() => setActiveTab('photos')}>
            Photos
          </button>
          <button type="button" className={activeTab === 'vidéos' ? styles.activeTab : ''} onClick={() => setActiveTab('vidéos')}>
            Vidéos
          </button>
          <button type="button" className={styles.moreTab} onClick={() => setMoreOpen((value) => !value)} aria-expanded={moreOpen}>
            Plus <span>⌄</span>
          </button>
        </nav>
      </section>

      {success && <p className={styles.statusSuccess} role="status">{success}</p>}
      {serverError && <FormError message={serverError} />}

      <div className={styles.contentGrid}>
        <aside className={styles.sidebar}>
          <section className={styles.card}>
            <div className={styles.cardHeading}>
              <h2>Amis</h2>
              <Link to="/friends">Voir tout</Link>
            </div>
            <div className={styles.friendsGrid}>
              {friends.map((friend) => (
                <div className={styles.friend} key={friend.name}>
                  <InitialAvatar name={friend.name} initials={friend.initials} />
                  <strong>{friend.name}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <h2>À propos</h2>
            <p className={styles.aboutLine}>Membre de link</p>
            {profile?.gender && <p className={styles.aboutLine}>{profile.gender}</p>}
          </section>
        </aside>

        <section className={styles.feed}>
          <section className={styles.composer}>
            <Avatar src={profile?.avatar_url} firstName={profile?.first_name} lastName={profile?.last_name} size="small" />
            <button type="button" className={styles.composerInput}>Quoi de neuf, {profile?.first_name || 'vous'} ?</button>
            <div className={styles.composerActions}>
              <button type="button" aria-label="Ajouter une photo"><span>▣</span> Photo</button>
              <button type="button" aria-label="Ajouter une vidéo"><span>▶</span> Vidéo</button>
            </div>
          </section>

          {visiblePublications.map((publication, index) => (
            <Publication key={publication.type + index} publication={publication} profile={profile} />
          ))}

          {!visiblePublications.length && (
            <div className={styles.emptyState}>
              <h2>Aucune publication</h2>
              <p>Les {activeTab.toLowerCase()} de ce profil apparaîtront ici.</p>
            </div>
          )}
        </section>
      </div>

      {editing && (
        <section className={styles.editCard}>
          <div className={styles.editHeader}>
            <div>
              <p className={styles.eyebrow}>Mon profil</p>
              <h2>Modifier mes informations</h2>
            </div>
            <AvatarUploader onChange={avatarChanged} />
          </div>

          <form onSubmit={save} noValidate>
            <div className={styles.row}>
              <Input label="Prénom" name="first_name" autoComplete="given-name" value={form.first_name} onChange={change} error={errors.first_name} />
              <Input label="Nom" name="last_name" autoComplete="family-name" value={form.last_name} onChange={change} error={errors.last_name} />
            </div>

            <Select
              label="Genre"
              name="gender"
              value={form.gender}
              onChange={change}
              error={errors.gender}
              options={[
                { value: 'femme', label: 'Femme' },
                { value: 'homme', label: 'Homme' },
                { value: 'personnalise', label: 'Personnalisé' },
              ]}
              placeholder="Sélectionnez votre genre"
            />

            <label className={styles.textareaLabel} htmlFor="bio">Bio</label>
            <textarea id="bio" name="bio" maxLength={300} value={form.bio} onChange={change} aria-describedby="bio-help" />
            <div id="bio-help" className={styles.counter}>{form.bio.length}/300</div>
            {errors.bio && <p className={styles.fieldError}>{errors.bio}</p>}

            <FormError message={serverError} />
            <Button type="submit" loading={pending}>Enregistrer</Button>
          </form>
        </section>
      )}
    </main>
  )
}
