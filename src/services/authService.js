import { supabase } from '@/lib/supabase'

export async function signUp({ email, password, first_name, last_name, birth_date, gender }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { first_name, last_name, birth_date, gender } },
  })
  return { data, error }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  const { data, error } = await supabase.auth.signOut()
  return { data, error }
}

export async function sendResetEmail(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  return { data, error }
}

export async function updatePassword(password) {
  const { data, error } = await supabase.auth.updateUser({ password })
  return { data, error }
}
