import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  Dispatch
} from 'react'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { dateTotal } from '../utils/generateExercise'

type Data = {
  completed: boolean
  time: number
}

interface FullContext extends Data {
  setCompleted: Dispatch<boolean>
}

export const CompletedContext = createContext<FullContext>({
  completed: false,
  time: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCompleted: () => {}
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const CompletedContextProvider = (props: any): JSX.Element => {
  const [completed, setCompleted] = useState(false)
  const { getItem, setItem } = useAsyncStorage('@deskjockeyfitness/complete')

  const currentTime = dateTotal()

  const readItemFromStorage = async () => {
    const item = await getItem()

    if (!item) return

    const fetchedData: Data = JSON.parse(item)

    if (fetchedData?.completed && fetchedData.time === currentTime) {
      setCompleted(true)
    }
  }

  const writeItemToStorage = async (newValue: Data) => {
    await setItem(JSON.stringify(newValue))
  }

  useEffect(() => {
    readItemFromStorage()
  }, [])

  useEffect(() => {
    writeItemToStorage({
      time:currentTime,
      completed,
    })
  }, [completed])

  const value = {
    time: currentTime,
    completed,
    setCompleted,
  }

  return <CompletedContext.Provider value={value} {...props} />
}

export const useCompleted = (): FullContext => {
  const context = useContext(CompletedContext)
  if (context === undefined) {
    throw new Error(`useCompleted must be used within a CompletedContextProvider.`)
  }
  return context
}
