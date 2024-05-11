import useStore from '@/store/useStore'
import { Button, SxProps, Theme, Typography, useTheme } from '@mui/material'

const CaptionDay = ({ index, currentDay, date, sx }: { index: number; currentDay: number; date: Date; sx?: SxProps<Theme> }) => {
  const theme = useTheme()
  const language = useStore((state) => state.language)
  return (
    <Button
      variant='text'
      sx={{
        width: 150,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: index + 1 === currentDay ? theme.palette.action.selected : 'inherit',
        ...sx
      }}
    >
      {new Intl.DateTimeFormat(language, { weekday: 'long' }).format(new Date(`2022-01-0${index + 3}`))}
      <Typography variant='caption' color={'GrayText'} sx={{ display: 'block' }}>
        {new Intl.DateTimeFormat(language, {}).format(new Date(date))}
      </Typography>
    </Button>
  )
}

export default CaptionDay
