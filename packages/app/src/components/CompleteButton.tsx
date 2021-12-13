import React, { useContext } from 'react'
import { Button } from 'react-native'
import { CompletedContext } from './CompletedContext'

const CompleteButton = () => {
  const { completed, setCompleted } = useContext(CompletedContext)

  const onPress = () => {
    setCompleted(!completed)
  }

  return (
    <Button
      title={completed ? 'Not completed' : 'Completed'}
      onPress={onPress}
    />
  )
}

export default CompleteButton
