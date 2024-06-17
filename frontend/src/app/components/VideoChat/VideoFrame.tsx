import { Box, Chip } from '@mui/material'
// import { useEffect, useRef } from 'react';
// import { Rnd } from 'react-rnd'
// import { useState } from 'react';

interface VideoFrameProps {
  muted?: boolean
  callingVideoRef: React.RefObject<HTMLVideoElement>
  name: string
}


const VideoFrame = ({ callingVideoRef, muted, name }: VideoFrameProps) => {
  // const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // const [size, setSize] = useState({ width: 320, height: 243 });

  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const animationFrameId = useRef<number>();

  // // Function to draw the VU meter
  // const drawVUMeter = (ctx: CanvasRenderingContext2D, volume: number) => {
  //   // Clear the canvas
  //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  //   // Draw the VU meter based on the volume
  //   ctx.fillStyle = 'green';
  //   ctx.fillRect(0, 0, ctx.canvas.width * volume, ctx.canvas.height);
  // };

  // useEffect(() => {
  //   if (callingVideoRef.current && canvasRef.current) {
  //     const audioContext = new AudioContext();
  //     const analyser = audioContext.createAnalyser();
  //     const source = audioContext.createMediaElementSource(callingVideoRef.current);
  //     source.connect(analyser);
  //     analyser.connect(audioContext.destination);
  
  //     // Check if the audio context is in a suspended state
  //     if (audioContext.state === 'suspended') {
  //       audioContext.resume();
  //     }
  
  //     const canvas = canvasRef.current;
  //     const ctx = canvas.getContext('2d')!;
  //     analyser.fftSize = 256;
  //     const bufferLength = analyser.frequencyBinCount;
  //     const dataArray = new Uint8Array(bufferLength);
  
  //     const renderFrame = () => {
  //       animationFrameId.current = requestAnimationFrame(renderFrame);
  //       analyser.getByteFrequencyData(dataArray);
  //       console.log(dataArray.reduce((a, b) => a + b, 0)); // Should log non-zero values if audio is present
  //     };
  
  //     renderFrame();
  //   }
  
  //   return () => {
  //     if (animationFrameId.current) {
  //       cancelAnimationFrame(animationFrameId.current);
  //     }
  //   };
  // }, [callingVideoRef]);
  
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
    //  {
      <Box sx={{ border: '2px solid gray', borderRadius: '5px', position: 'relative', padding: 0 }}>
        <Chip label={name} sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)'}} />
        <video playsInline ref={callingVideoRef} muted={!!muted} autoPlay style={{ width: '100%' }} />
        {/* <canvas ref={canvasRef} style={{ width: '100%' }} /> */}
      </Box>
    // }
    // </Rnd>
  );
};

export default VideoFrame;

