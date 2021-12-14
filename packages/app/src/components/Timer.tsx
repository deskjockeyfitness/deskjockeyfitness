import React, { useEffect, useState } from 'react'
import { View, Text, Pressable } from 'react-native'

type TimerProps = {
  time: number
  // eslint-disable-next-line @typescript-eslint/ban-types
  setOnDone?: Function
  disabled?: boolean
}

// eslint-disable-next-line @typescript-eslint/ban-types
const Timer = ({ time, setOnDone, disabled = false }: TimerProps): JSX.Element => {
  const [currentTime, setCurrentTime] = useState<number>(time)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(function() {
      if (started && currentTime > 0) {
        setCurrentTime(currentTime - 1)
      }
    }, 1000)

    if (currentTime === 0) {
      if (setOnDone) setOnDone(true)
      setStarted(false)
      setCurrentTime(time)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [currentTime, started])

  const onPress = () => {
    if (!disabled) setStarted(!started)
  }

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Pressable onPress={onPress}>
        <Text
          style={{
            color: '#0f172a',
            fontSize: 95,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {currentTime}
        </Text>
      </Pressable>
    </View>
  )  
}

export default Timer
