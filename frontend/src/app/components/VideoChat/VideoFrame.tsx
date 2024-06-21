import { memo, RefObject, useEffect, useRef, useState } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { Rnd } from 'react-rnd'
import VideoPanSlider from './VideoPanSlider'
import VUMeter from './VUMeter'

interface VideoFrameProps {
  muted?: boolean
  callingVideoRef: RefObject<HTMLVideoElement>
  name: string
  graphMode?: 'singleBar' | 'multipleBars'
  fullScreen?: boolean,
  me?: boolean
  dnd?: boolean
  splitScreen?: boolean
}

const VideoFrame: React.FC<VideoFrameProps> = ({ callingVideoRef, muted, name, graphMode, fullScreen, me, dnd, splitScreen }: VideoFrameProps) => {
  const audioStream = useRef<MediaStream | null>(null)
  const [position, setPosition] = useState({ x: 240, y: 570 })
  const [size, setSize] = useState<{ width: number | string; height: number | string }>({ width: 160, height: 121 })
  const boxRef = useRef<HTMLDivElement>(null)
  const [sliderValue, setSliderValue] = useState(5)

  useEffect(() => {
    audioStream.current = (callingVideoRef.current as any)?.captureStream()
  }, [callingVideoRef])

  const [streamAvailable, setStreamAvailable] = useState(false)

  useEffect(() => {
    const videoElement = callingVideoRef.current
    if (videoElement) {
      const handleLoadedMetadata = () => setStreamAvailable(true)      
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata)

      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }
  }, [callingVideoRef])

  const isMobile = useMediaQuery('(max-width: 600px)')

  useEffect(() => {
    if (!dnd) {
      return
    }
    const vw = window.innerWidth
    const vh = window.innerHeight - 196

    setSize({
      width: me ? Math.max((vw * 0.3), 160) : 'unset',
      height: me ? Math.max((vw * (me ? 0.3 : 1)), 160) * (3 / 4) : vh
    });

    setPosition({
      x: me ? vw - ((size.width as number) + 10) : 0,
      y: me ? vh - ((size.height as number) + 40) : 0
    });

    if (!boxRef.current) {
      return
    }
    boxRef.current.scrollLeft = scrollX

  }, []);

  const renderVideo = () =>
    <>
      <Box ref={boxRef} className="drag-handle" sx={{
        border: `${(me && dnd) ? '2' : '0'}px solid ${fullScreen ? '#0000' : 'gray'}`, borderRadius: '5px', position: (me && dnd) ? 'absolute' : 'relative', padding: 0, maxWidth: '100vw', height: '100%', overflowX: 'auto', overflowY: 'hidden', '&::-webkit-scrollbar': {
          display: 'none'
        },
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none'
      }}>
        {/* <Chip label={name} sx={{ position: me ? 'absolute' : 'sticky', top: 0, left: '50%', transform: 'translateX(-50%)' }} /> */}
        <video className={(me ? 'meVideo' : 'uVideo')} playsInline ref={callingVideoRef} muted={!!muted} width={!splitScreen && !me && isMobile ? 'unset' : '100%'} autoPlay height={!splitScreen && !me  && isMobile ? '100%' : 'unset'} />
      </Box>
      {<VUMeter stream={audioStream} streamAvailable={streamAvailable} graphMode={graphMode} />}
      {!me && !splitScreen && <VideoPanSlider sliderValue={sliderValue} setSliderValue={setSliderValue} boxRef={boxRef} />}
    </>

  if (dnd) {
    return (
      <Rnd
        bounds={'.dragContainer'}
        style={{ position: dnd ? 'absolute' : 'relative'}}
        dragHandleClassName="drag-handle"
        enableResizing={{ top: false, right: false, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
        size={size}
        position={position}
        onDragStop={(e, d) => {
          console.log(d)
          return setPosition({ x: d.x, y: d.y })
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            ...position,
          });
        }}
      >
        {renderVideo()}
      </Rnd>
    )
  } else {
    return renderVideo()
  }
}

VideoFrame.displayName = 'VideoFrame'

export default memo(VideoFrame)
