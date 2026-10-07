import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import styles from './AppLayout.module.css'

export default function AppLayout() {
  const { profile, signOut } = useAuth()
  const name = profile ? `${profile.first_name} ${profile.last_name}` : 'Mon profil'
  const initials = profile ? `${profile.first_name?.[0] ?? ''}${profile.last_name?.[0] ?? ''}` : '?'

  async function handleSignOut() {
    await signOut()
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link className={styles.brand} to="/">link</Link>
        <nav className={styles.nav} aria-label="Navigation principale">
          <Link className={styles.profileLink} to="/profile">
            <span className={styles.avatar}>{profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : initials}</span>
            <span className={styles.name}>{name}</span>
          </Link>
          <button className={styles.logout} type="button" onClick={handleSignOut}>Se déconnecter</button>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
