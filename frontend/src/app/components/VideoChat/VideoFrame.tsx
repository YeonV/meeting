import { Box, Chip, useMediaQuery } from '@mui/material'
import { memo, ReactNode, RefObject, use, useEffect, useRef, useState } from 'react'
import VUMeter from './VUMeter'
import { Fullscreen } from '@mui/icons-material'

interface VideoFrameProps {
  muted?: boolean
  callingVideoRef: RefObject<HTMLVideoElement>
  name: string
  graphMode?: 'singleBar' | 'multipleBars'
  fullScreen?: boolean
}

const VideoFrame: React.FC<VideoFrameProps> = ({ callingVideoRef, muted, name, graphMode, fullScreen }: VideoFrameProps) => {
  const audioStream = useRef<MediaStream | null>(null)

  useEffect(() => {
    audioStream.current = (callingVideoRef.current as any)?.captureStream()
    console.log('audioStreams:', audioStream.current)
  }, [callingVideoRef])

  const [streamAvailable, setStreamAvailable] = useState(false)

  useEffect(() => {
    const videoElement = callingVideoRef.current
    if (videoElement) {
      const handleLoadedMetadata = () => {
        setStreamAvailable(true)
      }
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata)

      // Clean up event listener on unmount
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }
  }, [callingVideoRef])

  const isMobile = useMediaQuery('(max-width: 600px)')

  return (
    // <Rnd
    //   size={size}
    //   position={position}
    //   onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
    //   onResizeStop={(e, direction, ref, delta, position) => {
    //     setSize({
    //       width: ref.offsetWidth,
    //       height: ref.offsetHeight,
    //       ...position,
    //     });
    //   }}
    // >
    <Box sx={{ border: `2px solid ${fullScreen ? '#0000' : 'gray'}`, borderRadius: '5px', position: 'relative', padding: 0, maxWidth: '100vw' }}>
      <Chip label={name} sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }} />
      <video playsInline ref={callingVideoRef} muted={!!muted} autoPlay style={{ width: '100%' }} />
      {<VUMeter stream={audioStream} streamAvailable={streamAvailable} graphMode={graphMode} />}
    </Box>
    // </Rnd>
  )
}

VideoFrame.displayName = 'VideoFrame'

export default memo(VideoFrame)
