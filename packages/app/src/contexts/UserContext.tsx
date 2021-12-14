import React, { useEffect, useState, createContext, useContext } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/initSupabase'

type DbUser = {
  id: string
  email: string
  completed: number
}

type UserContextProps = {
  user: User | null
  session: Session | null
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  session: null,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const UserContextProvider = (props: any): JSX.Element => {
  const [session, setSession] = useState<Session | null>(null)
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [user, setUser] = useState<DbUser | null>(null)

  useEffect(() => {
    const session = supabase.auth.session()
    setSession(session)
    setAuthUser(session?.user ?? null)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Supabase auth event: ${event}`)
      setSession(session)
      setAuthUser(session?.user ?? null)
    })

    async function addOrGetDbUser() {
      if (!authUser?.email) {
        setUser(null)

        return
      }

      const { data: userData, error } = await supabase
        .from<DbUser>('users')
        .select('email')
        .eq('email', authUser.email)

      if (userData && userData.length) {
        setUser(userData[0])
      } else {
        const { data: newUserData, error } = await supabase
          .from<DbUser>('users')
          .insert([
            { email: authUser.email }
          ])

        if (newUserData && newUserData.length) {
          setUser(newUserData[0])
        }
      }
    }

    addOrGetDbUser()

    return () => {
      authListener!.unsubscribe()
    }
  }, [])

  const value = {
    session,
    user,
  }
  return <UserContext.Provider value={value} {...props} />
}

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`)
  }
  return context
}
