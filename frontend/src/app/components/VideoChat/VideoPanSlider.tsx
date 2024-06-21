import { Box, IconButton, Slider } from '@mui/material'
import { memo, RefObject } from 'react'

import { SwitchCamera } from '@mui/icons-material'

interface VideoPanSliderProps {
  sliderValue: number
  setSliderValue: (value: number) => void
  boxRef: RefObject<HTMLDivElement>
}

const Dragger = ({ children, ...props }: any) => (
  <IconButton size='small' {...props}>
    {children}
    <SwitchCamera sx={{ fontSize: 16, marginTop: '-25px', marginLeft: '-25px', color: '#999' }} />
  </IconButton>
)
const VideoPanSlider: React.FC<VideoPanSliderProps> = ({ sliderValue, setSliderValue, boxRef }: VideoPanSliderProps) => {
  return (
    <Box sx={{ position: 'absolute', bottom: -8, left: 0, right: 0 }}>
      <Slider
        value={sliderValue}
        slots={{ thumb: Dragger }}
        onChange={(event, value) => {
          const percentage = value as number || 0
          setSliderValue(percentage);

          if (boxRef.current) {
            const maxScrollWidth = boxRef.current.scrollWidth - window.innerWidth;
            const scrollX = (maxScrollWidth * percentage) / 100;
            boxRef.current.scrollLeft = scrollX;
          }

        }}
        sx={{
          color: '#333',
          '& .MuiSlider-thumb': {
            '& .MuiSvgIcon-root': {
              fontSize: '1.5rem',
            }
          },
          '& .MuiSlider-track': {
            border: 'none',
            opacity: 0.5
          },
          '& .MuiSlider-rail': {
            opacity: 1,
          }
        }}
      /></Box>
  )
}

VideoPanSlider.displayName = 'VideoPanSlider'

export default memo(VideoPanSlider)
