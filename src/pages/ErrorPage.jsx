import { Link, useRouteError } from 'react-router-dom'
import styles from './SimplePage.module.css'

export default function ErrorPage() {
  const error = useRouteError()
  return <section className={styles.page}><h1>Une erreur est survenue</h1><p>{error?.message || 'Impossible d’afficher cette page.'}</p><Link to="/">Retour à l’accueil</Link></section>
}