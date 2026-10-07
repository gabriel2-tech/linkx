import { Link } from 'react-router-dom'
import styles from './SimplePage.module.css'

export default function NotFound() {
  return <section className={styles.page}><h1>Page introuvable</h1><p>Cette page n’existe pas.</p><Link to="/">Retour à l’accueil</Link></section>
}
