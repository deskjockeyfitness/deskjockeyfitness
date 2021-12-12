import React, { useEffect, useState } from 'react'
import { View, Text, Button, SafeAreaView } from 'react-native'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { supabase } from '../lib/initSupabase'
import { generateExercise, dateTotal } from '../utils/generateExercise'
import {
  Exercise,
  ExerciseData,
} from '../types'

export default function ExerciseFeed(): JSX.Element {
  const [allExercises, setAllExercises] = useState<Array<Exercise>>()
  const [picked, setPicked] = useState<ExerciseData>()
  const [completeValue, setCompleteValue] = useState<string>('')

  const { getItem, setItem } = useAsyncStorage('@deskjockeyfitness/complete')

  const readItemFromStorage = async () => {
    const item = await getItem();
    setCompleteValue(item || '')
  };

  const writeItemToStorage = async (newValue: string) => {
    await setItem(newValue);
    setCompleteValue(newValue)
  };

  const currentTime = dateTotal()

  const fetchExercises = async () => {
    const { data: exercises, error } = await supabase
      .from<Exercise>('exercises')
      .select('*')
      .order('id', { ascending: false })

    if (error) console.log('error', error)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    else setAllExercises(exercises!)
  }

  useEffect(() => {
    readItemFromStorage()
    fetchExercises()
  }, [])

  useEffect(() => {
    if (allExercises?.length) {
      const exercise = generateExercise(allExercises)
      setPicked(exercise)
    }
  }, [allExercises])

  const completedJson = completeValue ? JSON.parse(completeValue) : null

  const onClick = () => {
    if (completedJson && completedJson.time === currentTime) {
      writeItemToStorage('')
    }

    if (!completeValue) {
      writeItemToStorage(JSON.stringify({
        time: currentTime,
        completed: true,
      }))
    }

    if (completedJson && completedJson.time !== currentTime) {
      writeItemToStorage(JSON.stringify({
        time: currentTime,
        completed: true,
      }))
    }
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: completedJson && completedJson.time === currentTime ? '#3b82f6' : 'transparent',
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
      }}
    >
      <View>
        {picked && (
          <>
            <View>
              <Text
                style={{
                  color: '#0f172a',
                  fontSize: 95,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {picked.reps}
              </Text>
            </View>
            {picked.exercise.seconds && (
              <View>
                <Text
                  style={{
                    color: '#0f172a',
                    fontSize: 15,
                    fontWeight: '500',
                    marginBottom: 10,
                    marginTop: -10,
                    textAlign: 'center'
                  }}
                >
                  {'second'}
                </Text>
              </View>
            )}
            <View>
              <Text
                style={{
                  color: '#0f172a',
                  fontSize: 30,
                  fontWeight: '700',
                  marginBottom: 20,
                  textAlign: 'center'
                }}
              >
                {picked.exercise.name}
              </Text>
            </View>
            {picked.exercise.each && (
              <View>
                <Text
                  style={{
                    color: '#0f172a',
                    fontSize: 15,
                    fontWeight: '500',
                    marginBottom: 20,
                    textAlign: 'center'
                  }}
                >
                  {'(each side)'}
                </Text>
              </View>
            )}
            <Button
              title={completedJson && completedJson.time === currentTime ? 'Not complete' : 'Complete'}
              onPress={onClick}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  )
}
