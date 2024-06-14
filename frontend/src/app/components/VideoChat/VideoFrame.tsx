import { Box, Chip } from '@mui/material'
import { Rnd } from 'react-rnd'
import { useState } from 'react';

interface VideoFrameProps {
  muted?: boolean
  callingVideoRef: React.RefObject<HTMLVideoElement>
  name: string
}


const VideoFrame = ({ callingVideoRef, muted, name }: VideoFrameProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 320, height: 243 });

  return (
    <Rnd
      size={size}
      position={position}
      onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          ...position,
        });
      }}
    >
      <Box sx={{ border: '2px solid gray', borderRadius: '5px', position: 'relative', padding: 0 }}>
        <Chip label={name} sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)'}} />
        <video playsInline ref={callingVideoRef} muted={!!muted} autoPlay style={{ width: '100%' }} />
      </Box>
    </Rnd>
  );
};

export default VideoFrame;

