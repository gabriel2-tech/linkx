import { calculateAge, isRealDate } from './dates'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateName(value, label) {
  const trimmed = value.trim()
  if (!trimmed) return `${label} est obligatoire.`
  if (trimmed.length > 50) return `${label} ne peut pas dépasser 50 caractères.`
  return ''
}

export function validateEmail(value) {
  if (!value.trim()) return 'L’adresse e-mail est obligatoire.'
  if (!emailPattern.test(value.trim())) return 'Adresse e-mail invalide.'
  return ''
}

export function validatePassword(value) {
  if (!value) return 'Le mot de passe est obligatoire.'
  if (value.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.'
  return ''
}

export function validateBirthDate({ year, month, day }) {
  if (!year || !month || !day) return 'La date de naissance est obligatoire.'
  if (Number(year) < 1900 || !isRealDate(year, month, day)) return 'La date de naissance est invalide.'
  if (calculateAge(year, month, day) < 13) {
    return 'Tu dois avoir au moins 13 ans pour t’inscrire sur link.'
  }
  return ''
}

export function validateGender(value) {
  return value ? '' : 'Le genre est obligatoire.'
}

export function validateBio(value) {
  return value.length <= 300 ? '' : 'La bio ne peut pas dépasser 300 caractères.'
}

export function validateSignup(form) {
  const errors = {
    first_name: validateName(form.first_name, 'Le prénom'),
    last_name: validateName(form.last_name, 'Le nom'),
    birth_date: validateBirthDate(form.birth_date),
    gender: validateGender(form.gender),
    email: validateEmail(form.email),
    password: validatePassword(form.password),
  }
  return Object.fromEntries(Object.entries(errors).filter(([, value]) => value))
}

export function validateProfile(form) {
  const errors = {
    first_name: validateName(form.first_name, 'Le prénom'),
    last_name: validateName(form.last_name, 'Le nom'),
    gender: validateGender(form.gender),
    bio: validateBio(form.bio),
  }
  return Object.fromEntries(Object.entries(errors).filter(([, value]) => value))
}
