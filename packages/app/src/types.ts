export type Exercise = {
  id: number
  name: string
  each: boolean
  seconds: boolean
  created_at: string
}

export type CompareDate =
  string | number | Date | undefined

export type ExerciseData = {
  reps: number
  exercise: Exercise
}
