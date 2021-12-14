import React from 'react'
import { Button, View } from 'react-native'
import { UserContextProvider, useUser } from './contexts/UserContext'
import { CompletedContextProvider } from './contexts/CompletedContext'
import { TimeContextProvider } from './contexts/TimeContext'
import BackgroundLayout from './layouts/BackgroundLayout'
import Auth from './components/Auth'
import ExerciseFeed from './components/ExerciseFeed'
import { supabase } from './lib/initSupabase'

const Container = () => {
  const { user } = useUser()

  return user ? (
    <View>
      <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
    </View>
  ) : (
    <Auth />
  )
}

export function App(): JSX.Element {
  return (
    <UserContextProvider>
      <TimeContextProvider>
        <CompletedContextProvider>
          <BackgroundLayout>
            {/* <Container /> */}
            <ExerciseFeed />
          </BackgroundLayout>
        </CompletedContextProvider>
      </TimeContextProvider>
    </UserContextProvider>
  )
}
