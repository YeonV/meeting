import { useEffect, useState } from 'react'

export const useUserMedia = (constraints: { audio?: boolean | MediaTrackConstraints; video?: boolean | MediaTrackConstraints }) => {
  const [mediaStream, setMediaStream] = useState<MediaStream>()

  useEffect(() => {
    let mounted = true

    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        if (mounted) {
          setMediaStream(stream)
        }
      } catch (err) {
        // Handle error
      }
    }

    if (!mediaStream) {
      enableStream()
    } else {
      return function cleanup() {
        mounted = false
        mediaStream.getTracks().forEach((track) => {
          track.stop()
        })
      }
    }
  }, [mediaStream, constraints])

  return mediaStream
}
