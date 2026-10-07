import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getProfile } from '@/services/profileService'
import { signOut as signOutService } from '@/services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recoverySession, setRecoverySession] = useState(false)

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
      if (attempt < 2 && error) await new Promise((resolve) => setTimeout(resolve, 500))
    }
    setProfile(null)
  }, [session?.user?.id])

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (active) setSession(data.session)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      if (event === 'PASSWORD_RECOVERY') setRecoverySession(true)
      if (event === 'SIGNED_OUT') setRecoverySession(false)
    })

    return () => {
      active = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let active = true
    const id = session?.user?.id

    async function loadProfile() {
      if (!id) {
        setProfile(null)
        setLoading(false)
        return
      }

      setLoading(true)
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const { data } = await getProfile(id)
        if (data) {
          if (active) {
            setProfile(data)
            setLoading(false)
          }
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
  }, [id])

  const signOut = useCallback(async () => {
    const result = await signOutService()
    if (!result.error) {
      setSession(null)
      setProfile(null)
      setRecoverySession(false)
    }
    return result
  }, [])

  const user = session?.user ?? null

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, recoverySession, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider.')
  return context
}
