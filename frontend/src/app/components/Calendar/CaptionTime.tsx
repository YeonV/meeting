import { formatTime } from '@/lib/utils'
import useStore from '@/store/useStore'
import { Button, SxProps, Theme, useTheme } from '@mui/material'
import { MutableRefObject } from 'react'

const CaptionTime = ({
  slot,
  slotIndex,
  currentSlot,
  scrollRef,
  hourGutter,
  sx
}: {
  slot: any
  slotIndex: number
  currentSlot: number
  scrollRef: MutableRefObject<HTMLButtonElement | null>
  hourGutter?: boolean
  sx?: SxProps<Theme>
}) => {
  const theme = useTheme()
  const language = useStore((state) => state.language)
  const [whole, fraction] = slot.split('.')
  const minutes = fraction ? (parseInt(fraction) * 60) / 100 : '00'
  const iscurrentSlot = Number(slot) <= currentSlot && Number(slot) + 0.25 > currentSlot
  return (
    <Button
      variant='text'
      ref={iscurrentSlot ? scrollRef : null}
      sx={{
        color: slotIndex % 4 === 0 ? 'inherit' : 'grey',
        height: 57,
        marginBottom: hourGutter && slotIndex % 4 === 3 ? 2 : 0,
        pointerEvents: 'none',
        width: 50,
        backgroundColor: iscurrentSlot ? theme.palette.action.selected : 'inherit',
        ...sx
      }}
    >
      {formatTime(whole, minutes, language)}
    </Button>
  )
}

export default CaptionTime
