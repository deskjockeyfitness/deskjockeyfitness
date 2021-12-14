import React, { useContext } from 'react'
import { Pressable, Text, View } from 'react-native'
import { CompletedContext } from '../contexts/CompletedContext'

const CompleteButton = (): JSX.Element => {
  const { completed, setCompleted } = useContext(CompletedContext)

  const onPress = () => {
    setCompleted(!completed)
  }

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
      }}
    >
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: completed ? '#1e293b' : '#3b82f6',
          borderRadius: 5,
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 15,
            fontWeight: '600',
          }}
        >
          {completed ? 'Redo' : 'Done'}
        </Text>
      </Pressable>
    </View>
  )
}

export default CompleteButton
