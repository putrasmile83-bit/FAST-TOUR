import { useEffect, useRef } from 'react'

/**
 * Sound Notification Component
 * Plays "cengkring" sound on payment success/failed
 * Uses Web Audio API for cross-platform compatibility
 */
export function SoundNotification({ type = 'success', autoPlay = true }) {
  const audioRef = useRef(null)

  /**
   * Generate a simple "cengkring" beep sound using Web Audio API
   * This creates a bell-like sound effect
   */
  const generateCengkringSound = (audioContext, type) => {
    const duration = 0.8
    const sampleRate = audioContext.sampleRate

    // Create oscillator for the beep
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Create frequency sweep for bell-like sound
    const now = audioContext.currentTime
    
    if (type === 'success') {
      // Success: ascending beep (high pitch)
      oscillator.frequency.setValueAtTime(600, now)
      oscillator.frequency.exponentialRampToValueAtTime(900, now + 0.2)
      oscillator.frequency.exponentialRampToValueAtTime(800, now + duration)
    } else if (type === 'failed') {
      // Failed: descending beep (lower pitch)
      oscillator.frequency.setValueAtTime(400, now)
      oscillator.frequency.exponentialRampToValueAtTime(200, now + duration)
    } else {
      // Default: neutral beep
      oscillator.frequency.setValueAtTime(500, now)
    }

    // Envelope
    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration)

    oscillator.start(now)
    oscillator.stop(now + duration)

    return duration
  }

  const playSound = async () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      await generateCengkringSound(audioContext, type)
    } catch (error) {
      console.error('Error playing sound:', error)
    }
  }

  useEffect(() => {
    if (autoPlay) {
      // Small delay to ensure component is mounted
      const timer = setTimeout(playSound, 300)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, type])

  return (
    <div className="sound-notification">
      <audio
        ref={audioRef}
        style={{ display: 'none' }}
        controls
      />
      <button
        className="btn btn-secondary"
        onClick={playSound}
        title="Play notification sound"
      >
        🔊 Play Sound
      </button>
    </div>
  )
}

export default SoundNotification
