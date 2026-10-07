import { Link, useNavigate } from 'react-router-dom'
import Avatar from '@/components/ui/Avatar'
import { friends } from '@/data/friends'
import styles from './Friends.module.css'

function FriendAvatar({ friend }) {
  return (
    <span className={styles.avatar} aria-hidden="true">
      {friend.initials}
    </span>
  )
}

export default function Friends() {
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backButton} onClick={() => navigate(-1)} aria-label="Retour">
          ←
        </button>
        <div>
          <p className={styles.eyebrow}>Profil</p>
          <h1>Amis</h1>
          <p>{friends.length} amis affichés</p>
        </div>
      </header>

      <section className={styles.card} aria-label="Liste des amis">
        <div className={styles.cardTitle}>
          <h2>Tous les amis</h2>
          <span>{friends.length}</span>
        </div>

        <div className={styles.grid}>
          {friends.map((friend) => (
            <article className={styles.friend} key={friend.id}>
              <FriendAvatar friend={friend} />
              <div className={styles.friendInfo}>
                <strong>{friend.name}</strong>
                <span>{friend.mutual} amis en commun</span>
              </div>
              <button type="button" className={styles.messageButton}>Message</button>
            </article>
          ))}
        </div>
      </section>

      <Link className={styles.profileLink} to="/profile">
        ← Retour au profil
      </Link>
    </main>
  )
}
