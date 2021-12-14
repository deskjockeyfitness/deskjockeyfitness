import React, { useEffect, useState, useContext } from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import { supabase } from '../lib/initSupabase'
import { generateExercise } from '../utils/generateExercise'
import { CompletedContext } from '../contexts/CompletedContext'
import { TimeContext } from '../contexts/TimeContext'
import Timer from './Timer'
import CompleteButton from './CompleteButton'
import {
  Exercise,
  ExerciseData,
} from '../types'

export default function ExerciseFeed(): JSX.Element {
  const [allExercises, setAllExercises] = useState<Array<Exercise>>()
  const [picked, setPicked] = useState<ExerciseData>()
  const [timerDone, setTimerDone] = useState(false)

  const { completed, setCompleted } = useContext(CompletedContext)

  const { secRemaining } = useContext(TimeContext)

  // Get all exercises from db
  useEffect(() => {
    async function fetchData() {
      const { data: exercises, error } = await supabase
        .from<Exercise>('exercises')
        .select('*')
  
      if (error) console.log('error', error)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      else if (exercises && exercises.length) setAllExercises(exercises)
    }

    fetchData()
  }, [])

  // Pick an exercise when all are fetched
  useEffect(() => {
    if (allExercises?.length) {
      const exercise = generateExercise(allExercises)
      setPicked(exercise)
    }
  }, [allExercises])

  // Set next exercise every hour, on the hour
  useEffect(() => {
    if (secRemaining <= 0 || secRemaining >= 3600) {
      if (allExercises?.length) {
        const exercise = generateExercise(allExercises)
        setPicked(exercise)
      }
    }
  }, [secRemaining])

  useEffect(() => {
    if (secRemaining % 3 === 0) {
      if (allExercises?.length) {
        const exercise = generateExercise(allExercises)
        setPicked(exercise)
      }
    }
  }, [secRemaining])

  // Set as completed when timer runs out
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
        width: '100%',
      }}
    >
      <View
        style={{
          width: '100%',
        }}
      >
        {picked ? (
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
                    marginTop: -10,
                    textAlign: 'center'
                  }}
                >
                  {'(each side)'}
                </Text>
              </View>
            )}
            <CompleteButton />
          </>
        ) : (
          <View>
            <Text
              style={{
                color: '#0f172a',
                fontSize: 25,
                fontWeight: '500',
                marginBottom: 20,
                textAlign: 'center'
              }}
            >
              Loading next exercise...
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}
