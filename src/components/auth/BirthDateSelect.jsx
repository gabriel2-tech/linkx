import { MONTHS, getYears } from '@/utils/dates'
import styles from './BirthDateSelect.module.css'

export default function BirthDateSelect({ value, onChange, error }) {
  function set(key, next) { onChange({ ...value, [key]: next }) }
  const errorId = 'birth-date-error'
  return <fieldset className={styles.fieldset} aria-describedby={error ? errorId : undefined}>
    <legend>Date de naissance</legend>
    <div className={styles.row}>
      <select aria-label="Jour" autoComplete="bday-day" value={value.day} onChange={(e) => set('day', e.target.value)}>
        <option value="">Jour</option>{Array.from({ length: 31 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
      </select>
      <select aria-label="Mois" autoComplete="bday-month" value={value.month} onChange={(e) => set('month', e.target.value)}>
        <option value="">Mois</option>{MONTHS.map((month, i) => <option key={month} value={i + 1}>{month}</option>)}
      </select>
      <select aria-label="Année" autoComplete="bday-year" value={value.year} onChange={(e) => set('year', e.target.value)}>
        <option value="">Année</option>{getYears().map((year) => <option key={year} value={year}>{year}</option>)}
      </select>
    </div>
    {error && <p id={errorId} className={styles.error}>{error}</p>}
  </fieldset>
}
