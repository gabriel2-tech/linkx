import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getProfile } from '@/services/profileService'
import { signOut as signOutService } from '@/services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async () => {
    const id = session?.user?.id
    if (!id) {
      setProfile(null)
      return
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const { data, error } = await getProfile(id)
      if (data) {
        setProfile(data)
        return
      }
      if (attempt < 2 && error) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }
    setProfile(null)
  }, [session?.user?.id])

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (active) setSession(data.session)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) setSession(nextSession)
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let active = true

    async function loadProfile() {
      if (!session?.user?.id) {
        setProfile(null)
        if (active) setLoading(false)
        return
      }

      setLoading(true)
      const id = session.user.id
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const { data } = await getProfile(id)
        if (data) {
          if (active && session?.user?.id === id) setProfile(data)
          if (active) setLoading(false)
          return
        }
        if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 500))
      }
      if (active) {
        setProfile(null)
        setLoading(false)
      }
    }

    loadProfile()
    return () => { active = false }
  }, [session?.user?.id])

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      setLoading((current) => current)
    })
  }, [])

  const signOut = useCallback(async () => {
    const result = await signOutService()
    if (!result.error) {
      setSession(null)
      setProfile(null)
    }
    return result
  }, [])

  const user = session?.user ?? null

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider.')
  return context
}
