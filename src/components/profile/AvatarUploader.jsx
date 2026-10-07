import styles from './AvatarUploader.module.css'

export default function AvatarUploader({ onChange }) {
  function select(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 2 * 1024 * 1024) return
    onChange(file)
    event.target.value = ''
  }
  return <div className={styles.uploader}>
    <label htmlFor="avatar">Photo de profil</label>
    <input id="avatar" type="file" accept="image/*" onChange={select} />
    <small>Image uniquement, 2 Mo maximum.</small>
  </div>
}
