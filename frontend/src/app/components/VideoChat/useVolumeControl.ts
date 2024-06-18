import { useCallback, useState } from 'react'

export const useVolumeControl = (initialVolume: number, videoRef: React.RefObject<HTMLVideoElement>) => {
  const [volume, setVolume] = useState<number | number[]>(initialVolume)

  const handleVolumeChange = useCallback(
    (v: number | number[]) => {
      if (typeof v === 'number') {
        videoRef.current!.volume = v
      }
    },
    [videoRef]
  )

  const toggleMute = useCallback(() => {
    console.log('volume', volume)
    if (volume === 0.01 || volume === 0) {
      setVolume(1)
      handleVolumeChange(1)
    } else {
      setVolume(0.01)
      handleVolumeChange(0.01)
    }
  }, [volume, handleVolumeChange])

  return { volume, setVolume, handleVolumeChange, toggleMute }
}
