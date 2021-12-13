import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'

// eslint-disable-next-line @typescript-eslint/ban-types
const Timer = ({ time, setOnDone, disabled = false } : { time: number, setOnDone?: Function, disabled?: boolean}): JSX.Element => {
  const [currentTime, setCurrentTime] = useState<number>(time)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    setTimeout(function() {
      if (started && currentTime > 0) {
        setCurrentTime(currentTime - 1)
      }
    }, 1000)

    if (currentTime === 0) {
      if (setOnDone) setOnDone(true)
      setStarted(false)
      setCurrentTime(time)
    }
  }, [currentTime, started])

  const onPress = () => {
    if (!disabled) setStarted(!started)
  }

  return (
    <View>
      <Text
        onPress={onPress}
        style={{
          color: '#0f172a',
          fontSize: 95,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {currentTime}
      </Text>
    </View>
  )  
}

export default Timer
