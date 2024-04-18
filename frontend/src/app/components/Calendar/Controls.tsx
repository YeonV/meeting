import { getDateWeek, trans } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Button, Stack, SxProps, Theme } from '@mui/material'

const Controls = ({
  weekOffset,
  setWeekOffset,
  yearOffset,
  scrollRef,
  direction,
  sx
}: {
  weekOffset: number
  setWeekOffset: (weekOffset: number) => void
  yearOffset: number
  scrollRef: React.RefObject<HTMLButtonElement>
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  sx?: SxProps<Theme>
}) => {
  return (
    <Stack
      direction={direction || 'row'}
      spacing={0}
      sx={{
        flexGrow: 1,
        justifyContent: direction === 'column' ? 'center' : 'flex-end',
        marginBottom: direction === 'column' ? 0 : 2,
        right: 0,
        ...sx
      }}
      alignItems={'center'}
    >
      <Button onClick={() => setWeekOffset(weekOffset - 1)}>Heute</Button>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexGrow: direction === 'column' ? 1 : 0
        }}
      >
        <Button disabled={weekOffset === 0} sx={{ height: 30, width: 30, minWidth: 30 }} variant='text' onClick={() => setWeekOffset(weekOffset - 1)}>
          <ChevronLeft />
        </Button>
        <Button
          variant='text'
          onClick={() => {
            setWeekOffset(0)
            scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }}
        >
          {trans('weekOfYear')} {((getDateWeek() + weekOffset) % 53) + 1}
        </Button>

        <Button sx={{ height: 30, width: 30, minWidth: 30 }} variant='text' onClick={() => setWeekOffset(weekOffset + 1)}>
          <ChevronRight />
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexGrow: direction === 'column' ? 1 : 0
        }}
      >
        <Button
          disabled={weekOffset < 53}
          sx={{ height: 30, width: 30, minWidth: 30 }}
          variant='text'
          onClick={() => setWeekOffset(weekOffset >= 53 ? weekOffset - 53 : 0)}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant='text'
          onClick={() => {
            setWeekOffset(0)
            scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }}
        >
          {trans('year')} {new Date().getFullYear() + yearOffset}
        </Button>

        <Button sx={{ height: 30, width: 30, minWidth: 30 }} variant='text' onClick={() => setWeekOffset(weekOffset + 53)}>
          <ChevronRight />
        </Button>
      </div>
    </Stack>
  )
}

export default Controls
