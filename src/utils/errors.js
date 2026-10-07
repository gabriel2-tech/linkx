export function translateAuthError(error) {
  const message = error?.message || ''
  if (message === 'User already registered') return 'Cette adresse e-mail est déjà utilisée.'
  if (message === 'Database error saving new user') {
    return 'Impossible de créer le compte, vérifie les informations saisies.'
  }
  if (message.toLowerCase().includes('email not confirmed')) {
    return 'Confirme d’abord ton adresse e-mail via le lien reçu.'
  }
  return 'Une erreur est survenue. Réessaie dans quelques instants.'
}

export function translateProfileError() {
  return 'Impossible d’enregistrer le profil. Réessaie dans quelques instants.'
}
