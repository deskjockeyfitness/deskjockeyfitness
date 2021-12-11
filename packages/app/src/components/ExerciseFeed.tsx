import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { supabase } from '../lib/initSupabase'
import { generateExercise } from '../utils/generateExercise'
import {
  Exercise,
  ExerciseData,
} from '../types'

export default function ExerciseFeed(): JSX.Element {
  const [allExercises, setAllExercises] = useState<Array<Exercise>>()
  const [picked, setPicked] = useState<ExerciseData | undefined>()

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
    fetchExercises()
  }, [])

  useEffect(() => {
    if (allExercises?.length) {
      const exercise = generateExercise(allExercises)
      setPicked(exercise)
    }
  }, [allExercises])

  return (
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
                  marginTop: 10,
                  textAlign: 'center'
                }}
              >
                {'(each side)'}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  )
}
