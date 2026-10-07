import { supabase } from '@/lib/supabase'

export async function getProfile(id) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
  return { data, error }
}

export async function updateProfile(id, profile) {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function uploadAvatar(userId, file) {
  const { error } = await supabase.storage.from('avatars').upload(`${userId}/avatar.jpg`, file, {
    upsert: true,
    contentType: file.type,
  })

  if (error) return { data: null, error }

  const { data } = supabase.storage.from('avatars').getPublicUrl(`${userId}/avatar.jpg`)
  const avatarUrl = `${data.publicUrl}?t=${Date.now()}`
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId)
    .select()
    .single()

  return { data: profile, error: profileError }
}
