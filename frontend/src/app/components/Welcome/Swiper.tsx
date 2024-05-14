import Carousel from 'react-material-ui-carousel'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Image from 'next/image'
import mac from './mac.png'
import calendar from './calendar.png'
import { useState } from 'react'

const images = [
  {
    label: 'Emojis',
    imgPath: calendar
  },
  {
    label: 'Reactions',
    imgPath: calendar
  },
  {
    label: 'Private messaging',
    imgPath: calendar
  },
  {
    label: 'Group messaging',
    imgPath: calendar
  }
]

function Swiper() {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const maxSteps = images.length

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStepChange = (step: number) => {
    setActiveStep(step)
  }

  return (
    <>
      <Box sx={{ maxWidth: '800px', flexGrow: 1, position: 'relative' }}>
        <Box sx={{ width: '100%', maxWidth: '800px', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 30 }}>
          <Image style={{ width: 800, height: 'auto' }} src={mac} alt={'mac'} />
        </Box>
        <Box sx={{ maxWidth: '800px', flexGrow: 1, opacity: 0.5 }}>
          <Carousel animation='slide' sx={{ zIndex: 20 }} interval={6000}>
            {images.map((step, index) => (
              <div key={step.label}>
                {Math.abs(activeStep - index) <= 2 ? (
                  <Box sx={{ width: '100%', maxWidth: '800px', height: '800px', display: 'flex', position: 'relative' }}>
                    <Box sx={{ height: '415px', width: '734px', top: 33, left: 34, position: 'relative' }}>
                      <Image fill objectFit={'cover'} src={step.imgPath} alt={step.label} />
                    </Box>
                  </Box>
                ) : null}
              </div>
            ))}
          </Carousel>
        </Box>
      </Box>
    </>
  )
}

export default Swiper
