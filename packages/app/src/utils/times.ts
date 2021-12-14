type TimeObject = {
  minutes: number
  fullSeconds: number
  seconds: number
}

export function getCountdowns(): TimeObject {
  const date = new Date()
  const now = new Date().getTime()

  // Get next hour
  date.setHours(date.getHours() + 1)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)

  const distance = date.getTime() - now

  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  const fullSeconds = minutes > 0 ? (minutes * 60) + seconds : seconds

  return {
    minutes,
    fullSeconds,
    seconds,
  }
}
