import React, {
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react'
import { getCountdowns } from '../utils/times'

type Data = {
  minRemaining: number
  secRemaining: number
}

export const TimeContext = createContext<Data>({
  minRemaining: 60,
  secRemaining: 60,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const TimeContextProvider = (props: any): JSX.Element => {
  const [minRemaining, setMinRemaining] = useState<number>()
  const [secRemaining, setSecRemaining] = useState<number>()

  useEffect(() => {
    const timer = setTimeout(function () {
      setTime()
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [secRemaining])

  const setTime = () => {
    const { minutes, seconds } = getCountdowns()

    if (minutes !== minRemaining) setMinRemaining(minutes)

    const allSeconds = minutes > 0 ? (minutes * 60) + seconds : seconds

    if (allSeconds !== secRemaining) setSecRemaining(allSeconds)
  }

  const value = {
    minRemaining,
    secRemaining,
  }

  return <TimeContext.Provider value={value} {...props} />
}

export const useTime = (): Data => {
  const context = useContext(TimeContext)
  if (context === undefined) {
    throw new Error(`useTime must be used within a TimeContextProvider.`)
  }
  return context
}

export const useMinutes = (): number => {
  const context = useContext(TimeContext)
  if (context === undefined) {
    throw new Error(`useMinutes must be used within a TimeContextProvider.`)
  }
  return context.minRemaining
}

export const useFullSeconds = (): number => {
  const context = useContext(TimeContext)
  if (context === undefined) {
    throw new Error(`useFullSeconds must be used within a TimeContextProvider.`)
  }
  return context.secRemaining
}

export const useSeconds = (): number => {
  const context = useContext(TimeContext)
  if (context === undefined) {
    throw new Error(`useSeconds must be used within a TimeContextProvider.`)
  }
  return context.secRemaining % 60
}
