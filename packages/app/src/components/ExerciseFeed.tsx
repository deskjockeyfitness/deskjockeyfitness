import React, { useEffect, useState, useContext } from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import { supabase } from '../lib/initSupabase'
import { generateExercise } from '../utils/generateExercise'
import { CompletedContext } from './CompletedContext'
import Timer from './Timer'
import CompleteButton from './CompleteButton'
import {
  Exercise,
  ExerciseData,
} from '../types'

export default function ExerciseFeed({ timeRemaining } : { timeRemaining: number | undefined }): JSX.Element {
  const [allExercises, setAllExercises] = useState<Array<Exercise>>()
  const [picked, setPicked] = useState<ExerciseData>()
  const [timerDone, setTimerDone] = useState(false)

  const { completed, setCompleted } = useContext(CompletedContext)

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
    if (timeRemaining === 60) {
      fetchExercises()
    }
  }, [timeRemaining])

  useEffect(() => {
    if (allExercises?.length) {
      const exercise = generateExercise(allExercises)
      setPicked(exercise)
    }
  }, [allExercises])

  useEffect(() => {
    if (timerDone) setCompleted(true)
  }, [timerDone])

  return (
    <SafeAreaView
      style={{
        backgroundColor: completed ? '#3b82f6' : 'transparent',
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
      }}
    >
      <View>
        {picked && (
          <>
            {picked.exercise.seconds ? (
              <>
                <Timer time={picked.reps} setOnDone={setTimerDone} disabled={completed} />
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
              </>
            ) : (
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
            <CompleteButton />
          </>
        )}
      </View>
    </SafeAreaView>
  )
}
