import {
  CompareDate,
  Exercise,
  ExerciseData,
} from '../types'

export function generateExercise(exercises: Exercise[], date: CompareDate = undefined): ExerciseData | undefined {
  const seed = dateTotal(date)

  const filteredExercises = removeNewerExercises(exercises, date)

  if ( !filteredExercises?.length ) return undefined

  const exercise: Exercise = shuffle(filteredExercises, seed)[0]

  const availableReps: number[] = []

  if (exercise.seconds) {
    for (let i = 30; i <= 60; i++) {
      availableReps.push(i)
    }
  } else {
    for (let i = 10; i <= 20; i++) {
      availableReps.push(i)
    }
  }

  const reps = shuffle(availableReps, seed)[0]

  return {
    reps,
    exercise: exercise,
  }
}

export function dateTotal(givenDate: CompareDate = undefined): number {
  const date = givenDate ? new Date(givenDate) : new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDay()
  const hour = date.getHours()
  return year * month * day * hour
}

function removeNewerExercises(exercises: Exercise[], date: CompareDate = undefined): Exercise[] {
  if (!date) return exercises

  const compareTotal = dateTotal(date)

  console.log(compareTotal)

  return exercises.filter(exercise => {
    console.log(dateTotal(exercise.created_at), compareTotal)
    if (dateTotal(exercise.created_at) < compareTotal) return true
  })
}

function shuffle(array: any[], seed: number) {
  let m = array.length, t, i

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(random(seed) * m--)

    // And swap it with the current element.
    t = array[m]
    array[m] = array[i]
    array[i] = t
    ++seed
  }

  return array;
}

function random(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
