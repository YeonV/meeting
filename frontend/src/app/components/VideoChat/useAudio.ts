import { useState, useEffect, useRef } from 'react'

export const sound = (url: string) => {
  const audio = new Audio(url)
  audio.play().catch((err) => console.warn('Audio playback failed:', err))
}

function useAudio(url: string, loop = false, abortCondition = () => false) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [playing, setPlaying] = useState(false)

  const play = () => {
    if (!abortCondition() && audioRef.current) {
      audioRef.current
        .play()
        .catch((e) => console.warn('Audio playback failed:', e))
      setPlaying(true)
    }
  }

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlaying(false)
  }

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url)
    }
    const audio = audioRef.current
    audio.loop = loop

    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [url, loop])

  useEffect(() => {
    if (playing) {
      play()
    } else {
      stop()
    }
  }, [playing])

  return { play, stop }
}

export default useAudio
