import React, { useEffect, useState } from "react"
import {
  Button,
  Platform,
  SafeAreaView,
  View,
} from "react-native"
import { UserContextProvider, useUser } from './components/UserContext'
import Auth from './components/Auth'
import ExerciseFeed from './components/ExerciseFeed'
import { subPlatform } from "./config"
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
  const [timeRemaining, setTimeRemaining] = useState<number>()
  const [secondsLeft, setSecondsLeft] = useState<number | undefined>(60)
  const [greenOpacity, setGreenOpacity] = useState<number>()
  const [redOpacity, setRedOpacity] = useState<number>()

  const platformValue = subPlatform
    ? `${Platform.OS} (${subPlatform})`
    : Platform.OS

  console.log(platformValue)

  useEffect(() => {
    if (!timeRemaining) {
      setTimesAndColors()
    } else {
      setTimeout(function () {
        setSecondsLeft(undefined)
        setTimesAndColors()
      }, secondsLeft || 60000)
    }
  }, [timeRemaining])

  function setTimesAndColors() {
    const date = new Date()
    const minute = date.getMinutes()
    const seconds = date.getSeconds()

    if (seconds) {
      setSecondsLeft((60 - seconds) * 1000)
    }

    setTimeRemaining(60 - minute)

    const opacityTime = (60 - minute) / 60

    setGreenOpacity(0 +  opacityTime)
    setRedOpacity(1 - opacityTime)
  }

  return (
    <UserContextProvider>
      <SafeAreaView
        style={{
          backgroundColor: 'white',
          height: "100%",
        }}
      >
        <SafeAreaView
          style={{
            backgroundColor: `rgba(239, 68, 68, ${redOpacity})`,
            height: "100%",
          }}
        >
          <SafeAreaView
            style={{
              backgroundColor: `rgba(34, 197, 94, ${greenOpacity})`,
              height: "100%",
            }}
          >
            {/* <Container /> */}
            <ExerciseFeed timeRemaining={timeRemaining} />
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </UserContextProvider>
  )
}
