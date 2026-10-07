import { useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import styles from './Home.module.css'

const stories = [
  { name: 'Créer une story', type: 'create' },
  { name: 'Découverte', tone: 'blue' },
  { name: 'Tendance', tone: 'violet' },
  { name: 'Moments', tone: 'green' },
  { name: 'Créateurs', tone: 'orange' },
  { name: 'À voir', tone: 'pink' },
]

const posts = [
  {
    name: 'LinkX communauté',
    meta: 'Il y a 1 h · Public',
    text: 'Bienvenue sur LinkX. Partagez vos moments, vos idées et vos découvertes.',
    visual: 'community',
  },
  {
    name: 'Créateurs LinkX',
    meta: 'Il y a 3 h · Public',
    text: 'Un instant, une histoire. Qu’est-ce que vous créez aujourd’hui ?',
    visual: 'creator',
  },
]

function InitialAvatar({ label, className = '', imageUrl = '' }) {
  const initials = useMemo(
    () => label.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
    [label],
  )

  return (
    <span className={[styles.avatar, className].filter(Boolean).join(' ')} aria-hidden="true">
      {imageUrl ? <img src={imageUrl} alt="" /> : initials}
    </span>
  )
}

function Header({ profile }) {
  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Vous'

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarInner}>
        <div className={styles.headerLeft}>
          <a className={styles.logo} href="/" aria-label="LinkX">LinkX</a>
          <label className={styles.search}>
            <span aria-hidden="true">⌕</span>
            <input placeholder="Rechercher sur LinkX" aria-label="Rechercher" />
          </label>
        </div>

        <nav className={styles.mainNav} aria-label="Navigation principale">
          <a className={[styles.navIcon, styles.active].join(' ')} href="/" aria-label="Accueil">⌂</a>
          <a className={styles.navIcon} href="#stories" aria-label="Stories">▣</a>
          <a className={styles.navIcon} href="#discover" aria-label="Découvrir">▥</a>
          <a className={styles.navIcon} href="#community" aria-label="Communauté">◎</a>
        </nav>

        <div className={styles.actions}>
          <button type="button" aria-label="Menu">▦</button>
          <button type="button" aria-label="Messages">◌</button>
          <button type="button" aria-label="Notifications" className={styles.notification}>●<i>3</i></button>
          <a className={styles.headerProfile} href="/profile" aria-label="Ouvrir mon profil">
            <InitialAvatar label={name} imageUrl={profile?.avatar_url} />
            <strong>{name}</strong>
          </a>
        </div>
      </div>
    </header>
  )
}

function LeftSidebar({ profile }) {
  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Mon profil'

  return (
    <aside className={styles.leftSidebar}>
      <a className={styles.sideProfile} href="/profile">
        <InitialAvatar label={name} imageUrl={profile?.avatar_url} />
        <strong>{name}</strong>
      </a>

      <nav className={styles.sideNav} aria-label="Navigation secondaire">
        <a href="#discover"><span>✦</span> Découvrir</a>
        <a href="#community"><span>♧</span> Communauté</a>
        <a href="#videos"><span>▣</span> Vidéos</a>
        <a href="#saved"><span>🔖</span> Enregistrés</a>
        <a href="#events"><span>◷</span> Événements</a>
        <a href="#more"><span>⌄</span> Voir plus</a>
      </nav>

      <div className={styles.shortcuts}>
        <p>Vos raccourcis</p>
        <a href="#creators"><span className={styles.shortcutDot} /> Créateurs LinkX</a>
        <a href="#topics"><span className={styles.shortcutDot} /> Tendances</a>
        <a href="#friends"><span className={styles.shortcutDot} /> Mes contacts</a>
      </div>
    </aside>
  )
}

function RightSidebar() {
  return (
    <aside className={styles.rightSidebar}>
      <section className={styles.discovery}>
        <h2>À découvrir</h2>
        <div className={styles.suggestion}>
          <span className={[styles.avatar, styles.avatarPurple].join(' ')}>CR</span>
          <div><strong>Créateurs</strong><small>Découvrez de nouveaux profils</small></div>
          <button type="button">Suivre</button>
        </div>
        <div className={styles.suggestion}>
          <span className={[styles.avatar, styles.avatarGreen].join(' ')}>TR</span>
          <div><strong>Tendances</strong><small>Les sujets du moment</small></div>
          <button type="button">Voir</button>
        </div>
      </section>

      <section className={styles.sponsored}>
        <h2>Suggestions</h2>
        <div className={styles.sponsorCard}>
          <div className={styles.sponsorVisual}>LinkX</div>
          <strong>Partagez l'instant.</strong>
          <small>Découvrez les nouveautés de LinkX</small>
        </div>
      </section>

      <section className={styles.requests}>
        <div className={styles.sectionHeading}><h2>Demandes de contact</h2><button type="button">Voir tout</button></div>
        <div className={styles.request}>
          <span className={[styles.avatar, styles.avatarGold].join(' ')}>AM</span>
          <div><strong>Amis LinkX</strong><small>24 contacts en commun</small></div>
          <button type="button">Confirmer</button>
        </div>
      </section>

      <section className={styles.birthday}>
        <h2>Anniversaires</h2>
        <p><span>🎁</span> Un anniversaire à souhaiter aujourd’hui.</p>
      </section>
    </aside>
  )
}

function Stories({ profile }) {
  const name = profile?.first_name || 'Vous'

  return (
    <section className={styles.stories} id="stories" aria-label="Stories">
      {stories.map((story, index) => (
        <article
          className={[styles.story, story.type === 'create' ? styles.createStory : ''].filter(Boolean).join(' ')}
          key={story.name}
        >
          <div className={[styles.storyVisual, styles['tone' + (story.tone || index)]].join(' ')}>
            {story.type === 'create' ? (
              <>
                <InitialAvatar label={name} imageUrl={profile?.avatar_url} className={styles.storyAvatar} />
                <span className={styles.plus}>+</span>
              </>
            ) : (
              <span className={styles.storyAvatarRing}><span>{story.name.slice(0, 1)}</span></span>
            )}
          </div>
          <strong>{story.name}</strong>
        </article>
      ))}
    </section>
  )
}

function Composer({ profile }) {
  const name = profile?.first_name || 'vous'

  return (
    <section className={styles.composer}>
      <InitialAvatar label={name} imageUrl={profile?.avatar_url} />
      <button type="button">Quoi de neuf, {name} ?</button>
      <div className={styles.composerActions}>
        <button type="button" aria-label="Ajouter une photo">●</button>
        <button type="button" aria-label="Ajouter une vidéo">▧</button>
        <button type="button" aria-label="Créer une story">▶</button>
      </div>
    </section>
  )
}

function Post({ post }) {
  return (
    <article className={styles.post}>
      <header className={styles.postHeader}>
        <InitialAvatar label={post.name} />
        <div><strong>{post.name}</strong><small>{post.meta}</small></div>
        <button type="button" className={styles.more} aria-label="Plus d’options">•••</button>
      </header>
      <p className={styles.postText}>{post.text}</p>
      <div className={[styles.postVisual, styles[post.visual]].join(' ')}>
        <div className={styles.visualLabel}>LinkX</div>
        <strong>{post.visual === 'community' ? 'Partagez l’instant.' : 'Votre histoire commence ici.'}</strong>
      </div>
      <footer className={styles.postFooter}><span>💬 24 commentaires</span><span>↗ 8 partages</span></footer>
      <div className={styles.postActions}>
        <button type="button">Commenter</button>
        <button type="button">Partager</button>
      </div>
    </article>
  )
}

export default function Home() {
  const { profile } = useAuth()

  return (
    <div className={styles.home}>
      <Header profile={profile} />

      <div className={styles.shell}>
        <LeftSidebar profile={profile} />
        <main className={styles.feed}>
          <Stories profile={profile} />
          <Composer profile={profile} />
          {posts.map((post) => <Post key={post.name} post={post} />)}
        </main>
        <RightSidebar />
      </div>

      <button className={styles.fab} type="button" aria-label="Créer une publication">✎</button>
    </div>
  )
}
