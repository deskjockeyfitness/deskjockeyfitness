import React, { useEffect, useState, useContext } from 'react'
import { SafeAreaView } from 'react-native'
import { CompletedContext } from '../contexts/CompletedContext'
import { TimeContext } from '../contexts/TimeContext'
import { getCountdowns } from '../utils/times'

export default function BackgroundLayout({ children }: { children: React.ReactNode }): JSX.Element {
  const [greenOpacity, setGreenOpacity] = useState<number>()
  const [redOpacity, setRedOpacity] = useState<number>()
  const [remainderSeconds, setRemainderSeconds] = useState<number>()

  const { minRemaining, secRemaining } = useContext(TimeContext)
  const { completed } = useContext(CompletedContext)

  // Setup initial state
  useEffect(() => {
    const { minutes } = getCountdowns()

    setGreenOpacity(0 + (minutes / 60))
    setRedOpacity(1 - (minutes / 60))
    
    const extraSeconds = secRemaining % 60

    if (extraSeconds !== 0) {
      setRemainderSeconds(extraSeconds * 1000)
    }
  }, [])

  // Update colors every minute, on the minute
  useEffect(() => {
    const timer = setTimeout(function () {
      setRemainderSeconds(undefined)
      setColors()
    }, remainderSeconds || 60000)

    return () => {
      clearTimeout(timer)
    }
  }, [minRemaining, remainderSeconds])

  function setColors() {
    const opacityTime = minRemaining / 60

    setGreenOpacity(0 +  opacityTime)
    setRedOpacity(1 - opacityTime)
  }

  return (
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
          <SafeAreaView
            style={{
              backgroundColor: completed ? '#3b82f6' : 'transparent',
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {children}
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaView>
  )
}
