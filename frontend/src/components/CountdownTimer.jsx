import { useState, useEffect } from 'react'

export function CountdownTimer({ expiresAt, onExpired }) {
  const [countdown, setCountdown] = useState({
    minutes: 0,
    seconds: 0,
    formatted: '00:00',
    isExpired: false
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const expireTime = new Date(expiresAt).getTime()
      const timeLeft = expireTime - now

      if (timeLeft <= 0) {
        setCountdown({
          minutes: 0,
          seconds: 0,
          formatted: '00:00',
          isExpired: true
        })
        onExpired?.()
        clearInterval(interval)
      } else {
        const totalSeconds = Math.floor(timeLeft / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

        setCountdown({
          minutes,
          seconds,
          formatted,
          isExpired: false
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [expiresAt, onExpired])

  const isWarning = countdown.minutes === 0 && countdown.seconds <= 60
  const isCritical = countdown.minutes === 0 && countdown.seconds <= 10

  return (
    <div className={`countdown-timer ${isCritical ? 'critical' : isWarning ? 'warning' : ''}`}>
      <div className="countdown-label">Payment Expires In</div>
      <div className="countdown-display">{countdown.formatted}</div>
      {countdown.isExpired && (
        <div className="countdown-expired">Payment has expired. Please create a new payment request.</div>
      )}
    </div>
  )
}

export default CountdownTimer
