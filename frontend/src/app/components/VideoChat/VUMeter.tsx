import { MenuItem, Select } from '@mui/material'
import { MutableRefObject, useEffect, useRef, useState } from 'react'

interface VUMeterProps {
  stream: MutableRefObject<MediaStream | null>
  streamAvailable?: boolean
  graphMode?: 'singleBar' | 'multipleBars'
}

const VUMeter: React.FC<VUMeterProps> = ({ stream, streamAvailable, graphMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    console.log('streamAvailable:', streamAvailable)
    if (!streamAvailable) {
      return
    }
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 512 // Change this to more or less fine-tune your VU meter
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    console.log('EYYY', stream.current)
    if (stream.current instanceof MediaStream) {
      console.log('Audio tracks:', stream.current.getAudioTracks()) // Check audio tracks
      const source = audioContext.createMediaStreamSource(stream.current)
      source.connect(analyser)

      const canvas = canvasRef.current
      if (!canvas) {
        return
      }
      const canvasContext = canvas.getContext('2d')
      if (!canvasContext) {
        return
      }
      canvas.width = 400
      canvasContext.clearRect(0, 0, canvas.width, canvas.height)

      const drawSingleBar = () => {
        const WIDTH = canvas.width
        const HEIGHT = canvas.height

        requestAnimationFrame(drawSingleBar)

        analyser.getByteFrequencyData(dataArray)

        // Calculate the average volume
        const avgVolume = dataArray.reduce((p, c) => p + c, 0) / bufferLength

        // Clear the canvas
        canvasContext.fillStyle = 'black'
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT)

        // Set the fill style based on the average volume
        if (avgVolume < 70) {
          canvasContext.fillStyle = 'green'
        } else if (avgVolume < 90) {
          canvasContext.fillStyle = 'yellow'
        } else {
          canvasContext.fillStyle = 'red'
        }

        // Draw the bar
        canvasContext.fillRect(0, 0, (avgVolume / 100) * WIDTH, HEIGHT)
      }

      const drawMultipleBars = () => {
        const WIDTH = canvas.width
        const HEIGHT = canvas.height

        requestAnimationFrame(drawMultipleBars)

        analyser.getByteFrequencyData(dataArray)

        canvasContext.fillStyle = 'rgb(0, 0, 0)'
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT)

        let barWidth = (WIDTH / bufferLength) * 2.5
        let barHeight
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i]
          // console.log('barHeight:', barHeight)

          canvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)'
          canvasContext.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2)

          x += barWidth + 1
        }
      }
      let draw

      switch (graphMode) {
        case 'singleBar':
          draw = drawSingleBar
          break
        case 'multipleBars':
        default:
          draw = drawMultipleBars
          break
      }
      draw()
    }
  }, [stream, streamAvailable, graphMode])

  return (
    <>
      <canvas
        ref={canvasRef}
        height={graphMode === 'singleBar' ? 15 : 'auto'}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%'
        }}
      />
    </>
  )
}

export default VUMeter
