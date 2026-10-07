import { useAuth } from '@/context/AuthContext'
import styles from './Home.module.css'

export default function Home() {
  const { profile } = useAuth()
  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Bienvenue sur link</p>
        <h1>Bienvenue {profile?.first_name || ''} 👋</h1>
        <p>Ton fil d’actualité arrivera ici. link accueillera bientôt les vidéos éphémères, les commentaires et les vues.</p>
      </div>
    </section>
  )
}
