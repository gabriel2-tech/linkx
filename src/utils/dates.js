export const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

export function getYears() {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: currentYear - 1899 }, (_, index) => currentYear - index)
}

export function isRealDate(year, month, day) {
  if (!year || !month || !day) return false
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)
}

export function calculateAge(year, month, day) {
  const today = new Date()
  let age = today.getFullYear() - Number(year)
  const beforeBirthday =
    today.getMonth() + 1 < Number(month) ||
    (today.getMonth() + 1 === Number(month) && today.getDate() < Number(day))
  if (beforeBirthday) age -= 1
  return age
}

export function formatBirthDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
